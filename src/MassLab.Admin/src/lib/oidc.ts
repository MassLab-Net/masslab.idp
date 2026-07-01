import type { AuthSession, AuthUser } from "@/lib/auth";

type PendingLogin = {
  state: string;
  codeVerifier: string;
  identityBaseUrl: string;
  organizationSlug?: string;
  returnTo: string;
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
  system_admin?: boolean;
  tenant_admin?: boolean;
  permissions?: string[];
};

const LOGIN_KEY = "masslab.iam.oidc.pending";

const defaultIdentityRootUrl = import.meta.env.VITE_IDENTITY_ROOT_URL ?? "http://localhost:5000";
const clientId = import.meta.env.VITE_IDENTITY_CLIENT_ID ?? "masslab-admin-spa";
const requestedScope = import.meta.env.VITE_IDENTITY_SCOPE ?? "openid profile email permissions";

export async function beginLogin(input: { organizationSlug?: string; returnTo?: string }) {
  if (typeof window === "undefined") {
    throw new Error("OIDC login can only start in the browser.");
  }

  const identityBaseUrl = resolveIdentityBaseUrl(input.organizationSlug);
  const state = randomString(32);
  const codeVerifier = randomString(64);
  const returnTo = input.returnTo ?? "/admin/dashboard";
  const codeChallenge = await createCodeChallenge(codeVerifier);

  const login: PendingLogin = {
    state,
    codeVerifier,
    identityBaseUrl,
    organizationSlug: normalizeSlug(input.organizationSlug),
    returnTo,
  };

  sessionStorage.setItem(LOGIN_KEY, JSON.stringify(login));

  const redirectUri = getRedirectUri();
  const authorizeUrl = new URL("/connect/authorize", identityBaseUrl);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", requestedScope);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);

  window.location.assign(authorizeUrl.toString());
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
    throw new Error(url.searchParams.get("error_description") ?? error);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== pending.state) {
    throw new Error("Identity callback is invalid or has expired.");
  }

  const tokenResponse = await exchangeCodeForToken(pending.identityBaseUrl, code, pending.codeVerifier);
  const userInfo = await getUserInfo(pending.identityBaseUrl, tokenResponse.access_token);

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
      user: mapUser(userInfo, pending.organizationSlug),
    },
  };
}

export function buildLogoutUrl(session: AuthSession) {
  const url = new URL("/connect/logout", session.identityBaseUrl);
  url.searchParams.set("post_logout_redirect_uri", new URL("/", window.location.origin).toString());
  if (session.idToken) {
    url.searchParams.set("id_token_hint", session.idToken);
  }

  return url.toString();
}

export function resolveIdentityBaseUrl(organizationSlug?: string) {
  const base = new URL(defaultIdentityRootUrl);
  const slug = normalizeSlug(organizationSlug);
  if (!slug) {
    return base.origin;
  }

  const hostname =
    base.hostname === "localhost"
      ? `${slug}.localhost`
      : base.hostname === "127.0.0.1"
        ? "127.0.0.1"
        : `${slug}.${base.hostname}`;

  return `${base.protocol}//${hostname}${base.port ? `:${base.port}` : ""}`;
}

function getRedirectUri() {
  return `${window.location.origin}/auth`;
}

async function exchangeCodeForToken(identityBaseUrl: string, code: string, codeVerifier: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: getRedirectUri(),
  });

  const response = await fetch(new URL("/connect/token", identityBaseUrl), {
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

async function getUserInfo(identityBaseUrl: string, accessToken: string) {
  const response = await fetch(new URL("/connect/userinfo", identityBaseUrl), {
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

  return {
    id: userInfo.sub ?? email ?? "me",
    name,
    email,
    username: email ? email.split("@")[0] : name.toLowerCase().replace(/\s+/g, "."),
    organization: organizationSlug ?? userInfo.tenant_id ?? "root",
    tenantId: userInfo.tenant_id,
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
