import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getStoredSession, persistSession } from "@/lib/auth-storage";
import { completeLogin, isRedirectingToInteractiveLoginError } from "@/lib/oidc";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticating — MassLab IAM" },
      { name: "description", content: "Completing sign-in with MassLab Identity." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(true);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const handledCallbackRef = useRef<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isCallback = url.searchParams.has("code") || url.searchParams.has("error");

    if (!isCallback) {
      if (getStoredSession()) {
        window.location.replace("/admin/dashboard");
        return;
      }

      window.location.replace("/login");
      return;
    }

    const callbackKey = `${url.pathname}${url.search}`;
    if (handledCallbackRef.current === callbackKey) {
      return;
    }

    handledCallbackRef.current = callbackKey;
    let cancelled = false;
    setLoading(true);
    setCallbackError(null);

    void completeLogin(window.location.href)
      .then(({ session, returnTo }) => {
        if (cancelled) {
          return;
        }

        persistSession(session);
        const nextUrl = normalizeReturnTo(returnTo);
        window.location.replace(nextUrl);

        // Fallback in case a browser extension or router hook interferes with replace().
        window.setTimeout(() => {
          if (window.location.pathname === "/auth") {
            window.location.href = nextUrl;
          }
        }, 50);
      })
      .catch((reason: unknown) => {
        if (cancelled) {
          return;
        }

        if (isRedirectingToInteractiveLoginError(reason)) {
          return;
        }

        setLoading(false);
        setCallbackError(reason instanceof Error ? reason.message : "Unable to complete sign-in.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-brand opacity-[0.10] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" />
      </div>

      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <div className="rounded-[28px] border border-border bg-card/88 p-8 shadow-card backdrop-blur">
            <div className="flex flex-col items-center text-center">
              <Link to="/" className="inline-flex">
                <Logo size={48} showWord={true} />
              </Link>

              <div className="mt-8 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand-soft text-primary">
                {callbackError ? <ShieldCheck className="h-8 w-8" /> : <Loader2 className="h-8 w-8 animate-spin" />}
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                {callbackError ? "Authentication needs attention" : "Authenticating with MassLab Identity"}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {callbackError
                  ? callbackError
                  : loading
                    ? "We are validating your Identity session and finishing the admin sign-in flow."
                    : "Waiting for an Identity response or a redirect back to the admin workspace."}
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button className="h-11 bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" asChild>
                  <Link to="/login">
                    Open backup login <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="h-11" asChild>
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function normalizeReturnTo(returnTo: string) {
  if (!returnTo || returnTo === "/auth" || returnTo.startsWith("/auth?")) {
    return "/admin/dashboard";
  }

  return returnTo;
}
