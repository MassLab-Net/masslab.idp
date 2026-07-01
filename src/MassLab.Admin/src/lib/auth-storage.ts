import type { AuthSession } from "@/lib/auth-types";

const KEY = "masslab.iam.session.v2";
const LOGOUT_MARKER_KEY = "masslab.iam.logout_in_progress";
const LOGOUT_SUPPRESSION_WINDOW_MS = 10000;

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session?.accessToken || !session?.user || !session?.identityBaseUrl) {
      clearStoredSession();
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      clearStoredSession();
      return null;
    }

    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function persistSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function markLogoutInProgress() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGOUT_MARKER_KEY, Date.now().toString());
}

export function isLogoutInProgress() {
  if (typeof window === "undefined") return false;

  const raw = sessionStorage.getItem(LOGOUT_MARKER_KEY);
  if (!raw) {
    return false;
  }

  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt > LOGOUT_SUPPRESSION_WINDOW_MS) {
    sessionStorage.removeItem(LOGOUT_MARKER_KEY);
    return false;
  }

  return true;
}

export function clearLogoutInProgress() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LOGOUT_MARKER_KEY);
}
