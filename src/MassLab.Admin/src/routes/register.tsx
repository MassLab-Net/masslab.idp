import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff, Loader2, User, Mail } from "lucide-react";

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
import { beginLogin } from "@/lib/oidc";
import { useI18n } from "@/lib/i18n";
import { Flag } from "@/components/flag";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — MassLab IAM" },
      { name: "description", content: "Create a new MassLab IAM account for your organization." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { t, lang, setLang } = useI18n();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t("reg.errName");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("reg.errEmail");
    if (!org.trim()) errs.org = t("reg.errOrg");
    if (password.length < 8) errs.password = t("reg.errPassword");
    if (password !== confirmPassword) errs.confirmPassword = t("reg.errConfirm");
    if (!agreed) errs.agreed = t("reg.errTerms");
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    toast.info("Redirecting to MassLab Identity...");
    beginLogin({ organizationSlug: org.trim() || undefined, returnTo: "/admin/dashboard" });
  };

  const submitSocial = async (kind: "google" | "entra") => {
    if (!org.trim()) { setErrors({ org: t("reg.errOrg") }); return; }
    setLoading(true);
    toast.info(kind === "google" ? "Continuing with Google in MassLab Identity..." : "Continuing with Microsoft Entra ID in MassLab Identity...");
    beginLogin({ organizationSlug: org.trim() || undefined, returnTo: "/admin/dashboard" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-brand opacity-[0.10] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" />
      </div>

      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center">
              <Link to="/">
                <Logo size={48} showWord={true} />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">{t("reg.fullName")}</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    autoComplete="name"
                    placeholder={t("reg.fullNamePlaceholder")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 pl-9"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">{t("reg.email")}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-9"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Organization */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-org">{t("login.org")}</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-org"
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
                {errors.org && <p className="text-xs text-destructive">{errors.org}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">{t("login.password")}</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
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
                {errors.password
                  ? <p className="text-xs text-destructive">{errors.password}</p>
                  : <p className="text-xs text-muted-foreground">{t("reg.passwordHint")}</p>
                }
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm">{t("reg.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="toggle confirm password"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              {/* Terms agreement */}
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(v) => setAgreed(!!v)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="agree" className="text-sm text-muted-foreground font-normal leading-snug">
                    {t("reg.agreePrefix")}{" "}
                    <Link to="/terms" className="text-primary hover:underline">{t("home.footerTerms")}</Link>
                    {" "}{t("reg.agreeAnd")}{" "}
                    <Link to="/privacy" className="text-primary hover:underline">{t("home.footerPrivacy")}</Link>
                  </Label>
                </div>
                {errors.agreed && <p className="text-xs text-destructive">{errors.agreed}</p>}
              </div>

              {/* Submit */}
              <Button
                onClick={submit}
                disabled={loading}
                className="h-11 w-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("reg.submit")}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-background px-3 text-muted-foreground">{t("login.or")}</span>
                </div>
              </div>

              {/* Social sign-up */}
              <div className="grid gap-2.5">
                <Button
                  variant="outline"
                  className="h-11 w-full justify-center gap-3"
                  onClick={() => submitSocial("google")}
                  disabled={loading}
                >
                  <GoogleIcon />
                  {t("reg.google")}
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-center gap-3"
                  onClick={() => submitSocial("entra")}
                  disabled={loading}
                >
                  <EntraIcon />
                  {t("reg.entra")}
                </Button>
              </div>

              {/* Back to login */}
              <p className="pt-2 text-center text-sm text-muted-foreground">
                {t("reg.hasAccount")}{" "}
                <Link to="/auth" className="font-semibold text-primary hover:underline">
                  {t("reg.signIn")}
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

        {/* Side panel — same as login */}
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
