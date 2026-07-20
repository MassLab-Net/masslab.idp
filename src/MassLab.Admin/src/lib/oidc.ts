import type { AuthSession, AuthUser } from "@/lib/auth-types";

type PendingLogin = {
  state: string;
  codeVerifier: string;
  identityBaseUrl: string;
  organizationSlug?: string;
  returnTo: string;
  mode: LoginMode;
  silentAttempted: boolean;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
};

type UserInfoResponse = {
  sub?: string;
  name?: string;
  email?: string;
  tenant_id?: string;
  tenant_name?: string;
  is_system_default_tenant?: boolean;
  system_admin?: boolean;
  tenant_admin?: boolean;
  remember_me?: boolean;
  permissions?: string[];
};

type LoginMode = "redirect" | "silent-first";

const LOGIN_KEY = "masslab.iam.oidc.pending";
const REDIRECTING_TO_INTERACTIVE_LOGIN = "__redirecting_to_interactive_login__";

const defaultIdentityRootUrl = import.meta.env.VITE_IDENTITY_ROOT_URL ?? "http://localhost:5000";
const clientId = import.meta.env.VITE_IDENTITY_CLIENT_ID ?? "masslab-admin-spa";
const requestedScope = import.meta.env.VITE_IDENTITY_SCOPE ?? "openid profile email permissions";
const configuredLoginMode = normalizeLoginMode(import.meta.env.VITE_IDENTITY_LOGIN_MODE);

export async function beginLogin(input: {
  organizationSlug?: string;
  returnTo?: string;
  mode?: LoginMode;
}) {
  if (typeof window === "undefined") {
    throw new Error("OIDC login can only start in the browser.");
  }

  const mode = input.mode ?? configuredLoginMode;
  const organizationSlug = normalizeSlug(input.organizationSlug);
  const identityBaseUrl = resolveIdentityBaseUrl();
  const state = randomString(32);
  const codeVerifier = randomString(64);
  const returnTo = input.returnTo ?? "/admin/dashboard";
  const codeChallenge = await createCodeChallenge(codeVerifier);

  const login: PendingLogin = {
    state,
    codeVerifier,
    identityBaseUrl,
    organizationSlug,
    returnTo,
    mode,
    silentAttempted: mode === "silent-first",
  };

  sessionStorage.setItem(LOGIN_KEY, JSON.stringify(login));

  window.location.assign(buildAuthorizeUrl(login, codeChallenge, mode === "silent-first"));
}

export async function completeLogin(callbackUrl: string): Promise<{ session: AuthSession; returnTo: string }> {
  if (typeof window === "undefined") {
    throw new Error("OIDC callback can only run in the browser.");
  }

  const pending = getPendingLogin();
  if (!pending) {
    throw new Error("Login session was not found. Start the sign-in flow again.");
  }

  const url = new URL(callbackUrl);
  const error = url.searchParams.get("error");
  if (error) {
    if (error === "login_required" && pending.mode === "silent-first" && pending.silentAttempted) {
      const retry = { ...pending, silentAttempted: false };
      sessionStorage.setItem(LOGIN_KEY, JSON.stringify(retry));
      window.location.assign(buildAuthorizeUrl(retry, await createCodeChallenge(pending.codeVerifier), false));
      throw new Error(REDIRECTING_TO_INTERACTIVE_LOGIN);
    }

    throw new Error(url.searchParams.get("error_description") ?? error);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== pending.state) {
    throw new Error("Identity callback is invalid or has expired.");
  }

  const tokenResponse = await exchangeCodeForToken(
    pending.identityBaseUrl,
    pending.organizationSlug,
    code,
    pending.codeVerifier,
  );
  const userInfo = await getUserInfo(
    pending.identityBaseUrl,
    pending.organizationSlug,
    tokenResponse.access_token,
  );

  clearPendingLogin();

  return {
    returnTo: pending.returnTo,
    session: {
      accessToken: tokenResponse.access_token,
      idToken: tokenResponse.id_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      identityBaseUrl: pending.identityBaseUrl,
      organizationSlug: pending.organizationSlug,
      rememberMe: !!userInfo.remember_me,
      user: mapUser(userInfo, pending.organizationSlug),
    },
  };
}

export function buildLogoutUrl(session: AuthSession) {
  const organizationSlug = normalizeSlug(session.organizationSlug);
  const url = buildTenantEndpointUrl(session.identityBaseUrl, organizationSlug, "/connect/logout");
  url.searchParams.set("post_logout_redirect_uri", new URL("/logout-complete", window.location.origin).toString());
  if (session.idToken) {
    url.searchParams.set("id_token_hint", session.idToken);
  }

  return url.toString();
}

export function isRedirectingToInteractiveLoginError(reason: unknown) {
  return reason instanceof Error && reason.message === REDIRECTING_TO_INTERACTIVE_LOGIN;
}

export function resolveIdentityBaseUrl() {
  const base = new URL(defaultIdentityRootUrl);
  return base.origin;
}

function getRedirectUri() {
  return `${window.location.origin}/auth`;
}

function buildAuthorizeUrl(login: PendingLogin, codeChallenge: string, promptNone: boolean) {
  const authorizeUrl = buildTenantEndpointUrl(login.identityBaseUrl, login.organizationSlug, "/connect/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", getRedirectUri());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", requestedScope);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", login.state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);

  if (promptNone) {
    authorizeUrl.searchParams.set("prompt", "none");
  }

  return authorizeUrl.toString();
}

async function exchangeCodeForToken(
  identityBaseUrl: string,
  organizationSlug: string | undefined,
  code: string,
  codeVerifier: string,
) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: getRedirectUri(),
  });

  const response = await fetch(buildTenantEndpointUrl(identityBaseUrl, organizationSlug, "/connect/token"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const payload = await safeReadJson(response);
    throw new Error(payload?.error_description ?? payload?.error ?? "Token exchange failed.");
  }

  return (await response.json()) as TokenResponse;
}

async function getUserInfo(identityBaseUrl: string, organizationSlug: string | undefined, accessToken: string) {
  const response = await fetch(buildTenantEndpointUrl(identityBaseUrl, organizationSlug, "/connect/userinfo"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load the signed-in user profile.");
  }

  return (await response.json()) as UserInfoResponse;
}

async function safeReadJson(response: Response) {
  try {
    return (await response.json()) as Record<string, string>;
  } catch {
    return null;
  }
}

function mapUser(userInfo: UserInfoResponse, organizationSlug?: string): AuthUser {
  const email = userInfo.email ?? "";
  const name = userInfo.name ?? email ?? "MassLab User";
  const organization = userInfo.tenant_name ?? organizationSlug ?? userInfo.tenant_id ?? "root";

  return {
    id: userInfo.sub ?? email ?? "me",
    name,
    email,
    username: email ? email.split("@")[0] : name.toLowerCase().replace(/\s+/g, "."),
    organization,
    tenantId: userInfo.tenant_id,
    isSystemDefaultTenant: !!userInfo.is_system_default_tenant,
    isSystemAdmin: !!userInfo.system_admin,
    isTenantAdmin: !!userInfo.tenant_admin,
    permissions: userInfo.permissions ?? [],
    title: userInfo.system_admin ? "System Administrator" : "Tenant Administrator",
  };
}

function getPendingLogin() {
  try {
    const raw = sessionStorage.getItem(LOGIN_KEY);
    return raw ? (JSON.parse(raw) as PendingLogin) : null;
  } catch {
    return null;
  }
}

function clearPendingLogin() {
  sessionStorage.removeItem(LOGIN_KEY);
}

function normalizeSlug(value?: string) {
  return value?.trim().toLowerCase() || undefined;
}

function buildTenantEndpointUrl(identityBaseUrl: string, organizationSlug: string | undefined, path: string) {
  const normalizedSlug = normalizeSlug(organizationSlug);
  return new URL(normalizedSlug ? `/${normalizedSlug}${path}` : path, identityBaseUrl);
}

function randomString(length: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function createCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toBase64Url(new Uint8Array(digest));
}

function toBase64Url(bytes: Uint8Array) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function normalizeLoginMode(value: string | undefined): LoginMode {
  return value === "redirect" ? "redirect" : "silent-first";
}
