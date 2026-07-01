import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredSession, useAuth } from "@/lib/auth";
import { beginLogin, completeLogin } from "@/lib/oidc";
import { useI18n } from "@/lib/i18n";
import { Flag } from "@/components/flag";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MassLab IAM" },
      { name: "description", content: "Sign in to MassLab IAM with username, Google, or Microsoft Entra ID." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [org, setOrg] = useState("");
  const [loading, setLoading] = useState<null | "pw" | "google" | "entra">(null);
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isCallback = url.searchParams.has("code") || url.searchParams.has("error");

    if (!isCallback) {
      if (getStoredSession()) {
        void navigate({ to: "/admin/dashboard", replace: true });
      }

      return;
    }

    let cancelled = false;
    setLoading("pw");
    setCallbackError(null);

    void completeLogin(window.location.href)
      .then(({ session, returnTo }) => {
        if (cancelled) {
          return;
        }

        signIn(session);
        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = "";
        cleanUrl.hash = "";
        window.history.replaceState({}, document.title, cleanUrl.pathname);
        void navigate({ to: returnTo as "/admin/dashboard", replace: true });
      })
      .catch((reason: unknown) => {
        if (cancelled) {
          return;
        }

        setLoading(null);
        setCallbackError(reason instanceof Error ? reason.message : "Unable to complete sign-in.");
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, signIn]);

  const submit = async (kind: "pw" | "google" | "entra") => {
    setLoading(kind);
    setCallbackError(null);
    toast.info(kind === "pw" ? "Redirecting to MassLab Identity..." : "Continuing with MassLab Identity...");

    try {
      await beginLogin({ organizationSlug: org.trim() || undefined, returnTo: "/admin/dashboard" });
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "Unable to start sign-in.";
      setLoading(null);
      setCallbackError(message);
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* decorative gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-brand opacity-[0.10] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" />
      </div>

      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo centered above form */}
            <div className="mb-8 flex flex-col items-center">
              <Link to="/">
                <Logo size={48} showWord={true} />
              </Link>
            </div>

            <div className="space-y-4">
              {callbackError ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {callbackError}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="org">{t("login.org")}</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="org"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder={t("login.orgPlaceholder")}
                    className="h-11 pl-9 pr-32"
                    autoComplete="organization"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    .masslab.io
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username">{t("login.username")}</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="you@company.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => toast.info(t("login.recovery"))}
                  >
                    {t("login.forgot")}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="toggle password"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal">
                  {t("login.remember")}
                </Label>
              </div>

              <Button
                onClick={() => submit("pw")}
                disabled={!!loading}
                className="h-11 w-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
              >
                {loading === "pw" ? <Loader2 className="h-4 w-4 animate-spin" /> : t("login.signin")}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-background px-3 text-muted-foreground">{t("login.or")}</span>
                </div>
              </div>

              <div className="grid gap-2.5">
                <Button
                  variant="outline"
                  className="h-11 w-full justify-center gap-3"
                  onClick={() => submit("google")}
                  disabled={!!loading}
                >
                  <GoogleIcon />
                  {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : t("login.google")}
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-center gap-3"
                  onClick={() => submit("entra")}
                  disabled={!!loading}
                >
                  <EntraIcon />
                  {loading === "entra" ? <Loader2 className="h-4 w-4 animate-spin" /> : t("login.entra")}
                </Button>
              </div>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                {t("login.new")}{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  {t("login.register")}
                </Link>
              </p>

              {/* Language switcher */}
              <div className="flex justify-center pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                      <Flag lang={lang} className="h-3.5 w-5 rounded-sm shadow-sm" />
                      <span className="text-sm">{lang === "vi" ? "Tiếng Việt" : "English"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-44">
                    <DropdownMenuLabel>{t("login.lang")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLang("en")} className="gap-2">
                      <Flag lang="en" className="h-3.5 w-5 rounded-sm" /> English
                      {lang === "en" && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLang("vi")} className="gap-2">
                      <Flag lang="vi" className="h-3.5 w-5 rounded-sm" /> Tiếng Việt
                      {lang === "vi" && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <aside className="relative hidden items-center justify-center overflow-hidden lg:flex">
          <div className="absolute inset-6 rounded-3xl bg-gradient-brand-soft" />
          <div className="absolute inset-6 rounded-3xl border border-border/70" />
          <div className="relative z-10 max-w-md px-10 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
              {t("login.tagline")}
            </div>
            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight">
              {t("login.headline1")} <span className="text-gradient-brand">{t("login.headline2")}</span>.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">{t("login.body")}</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { k: "12K+", v: t("login.stat.tenants") },
                { k: "4.8M", v: t("login.stat.identities") },
                { k: "99.99%", v: t("login.stat.uptime") },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-border bg-card/80 p-4 backdrop-blur">
                  <div className="text-xl font-bold text-gradient-brand">{s.k}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8a6 6 0 1 1 0-12c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.8 9.6-7.3 0-.5-.05-.9-.13-1.3H12z"/>
    </svg>
  );
}

function EntraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#0078D4" d="M11.5 2 2 20h6.4l3.1-6.1 3.1 6.1H21L11.5 2z"/>
    </svg>
  );
}
