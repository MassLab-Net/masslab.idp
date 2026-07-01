import { createContext, useContext, useState, type ReactNode } from "react";
import { clearStoredSession, getStoredSession, persistSession } from "@/lib/auth-storage";
import type { AuthSession, AuthUser } from "@/lib/auth-types";

type AuthContextValue = {
  ready: boolean;
  session: AuthSession | null;
  user: AuthUser | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [ready] = useState(true);

  const signIn = (nextSession: AuthSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  };

  const signOut = () => {
    clearStoredSession();
    setSession(null);
  };

  return <AuthContext.Provider value={{ ready, session, user: session?.user ?? null, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export type { AuthSession, AuthUser } from "@/lib/auth-types";
