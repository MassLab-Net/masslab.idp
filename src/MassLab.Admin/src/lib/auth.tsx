import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  organization: string;
  tenantId?: string;
  isSystemAdmin: boolean;
  isTenantAdmin: boolean;
  permissions: string[];
  avatar?: string;
  title: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt: number;
  identityBaseUrl: string;
  organizationSlug?: string;
};

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = "masslab.iam.session.v2";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const signIn = (nextSession: AuthSession) => {
    localStorage.setItem(KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    setSession(null);
  };

  return <AuthContext.Provider value={{ session, user: session?.user ?? null, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session?.accessToken || !session?.user || !session?.identityBaseUrl) {
      localStorage.removeItem(KEY);
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}
