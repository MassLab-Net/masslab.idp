import { createFileRoute } from "@tanstack/react-router";
import { Camera, KeyRound, Mail, ShieldCheck, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ROLES } from "@/lib/mock-data";
import { initials } from "@/components/app-sidebar";
import { toast } from "sonner";
import { identityFetch, type CommandResult, type MfaEnrollmentDto, type MfaRecoveryCodesDto, type MfaStatusDto } from "@/lib/identity-api";
import type { AuthSession } from "@/lib/auth-types";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "My Profile — MassLab IAM" }] }),
  component: Profile,
});

// ── Avatar Dialog ────────────────────────────────────────────────────────────
function AvatarDialog({
  open, onClose, currentInitials, avatarSrc, onSave,
}: { open: boolean; onClose: () => void; currentInitials: string; avatarSrc: string | null; onSave: (src: string | null) => void }) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarSrc);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("profile.avatarTitle")}</DialogTitle>
          <DialogDescription>{t("profile.avatarDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card shadow-card">
            {preview ? (
              <img src={preview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-xl bg-gradient-brand text-2xl font-bold text-primary-foreground">
                {currentInitials}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Camera className="mr-1.5 h-3.5 w-3.5" />{t("profile.avatarUpload")}
            </Button>
            {preview && <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>{t("profile.avatarRemove")}</Button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <p className="text-center text-xs text-muted-foreground">{t("profile.avatarHint")}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button className="bg-gradient-brand text-primary-foreground hover:opacity-90" onClick={() => { onSave(preview); toast.success(t("profile.avatarSaved")); onClose(); }}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Change Password Dialog ────────────────────────────────────────────────────
function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    if (!current) { setError(t("profile.pwErrCurrent")); return; }
    if (next.length < 8) { setError(t("profile.pwErrLength")); return; }
    if (next !== confirm) { setError(t("profile.pwErrMatch")); return; }
    toast.success(t("profile.pwChanged"));
    setCurrent(""); setNext(""); setConfirm(""); onClose();
  }

  function handleClose() { setCurrent(""); setNext(""); setConfirm(""); setError(""); onClose(); }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("profile.pwTitle")}</DialogTitle>
          <DialogDescription>{t("profile.pwDesc")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <PwField label={t("profile.pwCurrent")} value={current} onChange={setCurrent} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
          <PwField label={t("profile.pwNew")} value={next} onChange={setNext} show={showNew} onToggle={() => setShowNew(!showNew)} />
          <PwField label={t("profile.pwConfirm")} value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">{t("profile.pwHint")}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>{t("common.cancel")}</Button>
          <Button className="bg-gradient-brand text-primary-foreground hover:opacity-90" onClick={handleSave}>{t("profile.pwSave")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PwField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className="pr-9" />
        <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ── 2FA Dialog ───────────────────────────────────────────────────────────────
function TwoFADialog({ open, onClose, enabled, onToggle, session }: { open: boolean; onClose: () => void; enabled: boolean; onToggle: (v: boolean) => void; session: AuthSession | null }) {
  const { t } = useI18n();
  const [step, setStep] = useState<"overview" | "setup" | "disable" | "codes">("overview");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [enrollment, setEnrollment] = useState<MfaEnrollmentDto | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !session) return;
    void identityFetch<MfaStatusDto>(session, "/api/account/mfa")
      .then((status) => onToggle(status.enabled))
      .catch(() => toast.error("Unable to load two-factor authentication."));
  }, [open, session]);

  const startEnrollment = async () => {
    if (!session) return;
    setBusy(true);
    try {
      setEnrollment(await identityFetch<MfaEnrollmentDto>(session, "/api/account/mfa/enrollment", { method: "POST" }));
      setStep("setup");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Unable to start MFA enrollment.");
    } finally { setBusy(false); }
  };

  const verifyEnrollment = async () => {
    if (!session) return;
    if (otp.replace(/\s/g, "").length < 6) { setOtpError(t("profile.tfaOtpError")); return; }
    setBusy(true);
    try {
      await identityFetch<CommandResult>(session, "/api/account/mfa/verify", { method: "POST", body: JSON.stringify({ code: otp }) });
      onToggle(true); toast.success(t("profile.tfaEnabled")); setStep("overview"); setOtp("");
    } catch (reason) { setOtpError(reason instanceof Error ? reason.message : "Invalid verification code."); }
    finally { setBusy(false); }
  };

  const regenerateCodes = async () => {
    if (!session) return;
    setBusy(true);
    try {
      const result = await identityFetch<MfaRecoveryCodesDto>(session, "/api/account/mfa/recovery-codes", { method: "POST" });
      setCodes(result.codes); setStep("codes");
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Unable to generate recovery codes."); }
    finally { setBusy(false); }
  };

  function handleClose() { setStep("overview"); setOtp(""); setOtpError(""); onClose(); }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        {step === "overview" && (
          <>
            <DialogHeader><DialogTitle>{t("profile.tfaTitle")}</DialogTitle><DialogDescription>{t("profile.tfaDesc")}</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><div className="text-sm font-medium">{t("profile.tfaApp")}</div><div className="text-xs text-muted-foreground">{t("profile.tfaAppSub")}</div></div>
                <Switch checked={enabled} disabled={busy} onCheckedChange={(v) => { if (v) void startEnrollment(); else setStep("disable"); }} />
              </div>
              {enabled && <Button variant="outline" className="w-full" size="sm" onClick={() => void regenerateCodes()}>{t("profile.tfaViewCodes")}</Button>}
            </div>
            <DialogFooter><Button variant="outline" onClick={handleClose}>{t("common.close")}</Button></DialogFooter>
          </>
        )}
        {step === "setup" && (
          <>
            <DialogHeader><DialogTitle>{t("profile.tfaSetupTitle")}</DialogTitle><DialogDescription>{t("profile.tfaSetupDesc")}</DialogDescription></DialogHeader>
            <div className="flex flex-col items-center gap-4 py-2">
              {enrollment && <div className="w-full rounded-lg border border-border bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Enter this setup key in your authenticator app</p><code className="mt-2 block break-all text-sm font-semibold tracking-wider">{enrollment.secret}</code></div>}
              <div className="w-full space-y-1.5">
                <Label>{t("profile.tfaOtpLabel")}</Label>
                <Input placeholder="000 000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={7} className="text-center tracking-widest text-lg" />
                {otpError && <p className="text-xs text-destructive">{otpError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("overview")}>{t("common.cancel")}</Button>
              <Button disabled={busy} className="bg-gradient-brand text-primary-foreground hover:opacity-90" onClick={() => void verifyEnrollment()}>{t("profile.tfaVerify")}</Button>
            </DialogFooter>
          </>
        )}
        {step === "disable" && (
          <>
            <DialogHeader><DialogTitle>{t("profile.tfaDisableTitle")}</DialogTitle><DialogDescription>{t("profile.tfaDisableDesc")}</DialogDescription></DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("overview")}>{t("common.cancel")}</Button>
              <Button variant="destructive" disabled={busy} onClick={async () => { if (!session) return; const code = window.prompt("Enter your current authenticator code"); if (!code) return; setBusy(true); try { await identityFetch<CommandResult>(session, "/api/account/mfa/disable", { method: "POST", body: JSON.stringify({ code }) }); onToggle(false); toast.success(t("profile.tfaDisabled")); setStep("overview"); } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Unable to disable MFA."); } finally { setBusy(false); } }}>{t("profile.tfaDisableBtn")}</Button>
            </DialogFooter>
          </>
        )}
        {step === "codes" && (
          <>
            <DialogHeader><DialogTitle>{t("profile.tfaCodesTitle")}</DialogTitle><DialogDescription>{t("profile.tfaCodesDesc")}</DialogDescription></DialogHeader>
            <div className="grid grid-cols-2 gap-2 py-2">
              {codes.map((code) => (
                <button key={code} onClick={() => { navigator.clipboard.writeText(code); toast.success(t("profile.tfaCopied")); }}
                  className="flex items-center justify-between rounded border border-border px-3 py-1.5 font-mono text-sm hover:bg-accent">
                  {code} <Copy className="ml-1 h-3 w-3 text-muted-foreground" />
                </button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => void regenerateCodes()}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />{t("profile.tfaRegenerate")}
              </Button>
              <Button variant="outline" onClick={() => setStep("overview")}>{t("common.close")}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Recovery Email Dialog ─────────────────────────────────────────────────────
function RecoveryEmailDialog({ open, onClose, current, onSave }: { open: boolean; onClose: () => void; current: string; onSave: (email: string) => void }) {
  const { t } = useI18n();
  const [value, setValue] = useState(current);
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError(t("profile.recoveryError")); return; }
    onSave(value); toast.success(t("profile.recoverySaved")); onClose();
  }

  return (
    <Dialog open={open} onOpenChange={() => { setValue(current); setError(""); onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{t("profile.recoveryTitle")}</DialogTitle><DialogDescription>{t("profile.recoveryDesc")}</DialogDescription></DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>{t("profile.recoveryLabel")}</Label>
            <Input type="email" value={value} onChange={(e) => setValue(e.target.value)} placeholder="recovery@example.com" />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <p className="text-xs text-muted-foreground">{t("profile.recoveryHint")}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setValue(current); setError(""); onClose(); }}>{t("common.cancel")}</Button>
          <Button className="bg-gradient-brand text-primary-foreground hover:opacity-90" onClick={handleSave}>{t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Profile Component ────────────────────────────────────────────────────
function Profile() {
  const { session, user, signIn } = useAuth();
  const { t } = useI18n();

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [tfaOpen, setTfaOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(user?.avatar ?? null);
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [recoveryEmail, setRecoveryEmail] = useState("recover@masslab.io");

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t("profile.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </header>

      <Card className="overflow-hidden border-border shadow-card">
        <div className="h-28 bg-gradient-brand" />
        <CardContent className="-mt-12 flex flex-col gap-5 px-6 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card shadow-card">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <div className="grid h-full w-full place-items-center rounded-xl bg-gradient-brand text-2xl font-bold text-primary-foreground">
                    {initials(user.name)}
                  </div>
                )}
              </div>
              <button onClick={() => setAvatarOpen(true)} className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-card hover:text-foreground">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.title} · {user.organization}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">Super Administrator</Badge>
                <Badge variant="outline" className="font-normal">{t("profile.mfa")}</Badge>
              </div>
            </div>
          </div>
          <Button onClick={() => toast.success(t("profile.saved"))} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
            {t("profile.save")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base">{t("profile.account")}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label={t("profile.fullName")} defaultValue={user.name} />
            <Field label={t("profile.username")} defaultValue={user.username} />
            <Field label={t("profile.email")} defaultValue={user.email} type="email" />
            <Field label={t("profile.org")} defaultValue={user.organization} disabled />
            <Field label={t("profile.job")} defaultValue={user.title} />
            <Field label={t("profile.tz")} defaultValue="Asia/Ho_Chi_Minh (GMT+7)" />
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader><CardTitle className="text-base">{t("profile.security")}</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <SecurityRow icon={KeyRound} title={t("profile.password")} sub={t("profile.passwordSub")} action={t("profile.change")} onAction={() => setPasswordOpen(true)} />
            <Separator />
            <SecurityRow icon={ShieldCheck} title={t("profile.twofa")} sub={t("profile.twofaSub")} action={t("profile.manage")} badge={tfaEnabled ? t("profile.on") : undefined} onAction={() => setTfaOpen(true)} />
            <Separator />
            <SecurityRow icon={Mail} title={t("profile.recovery")} sub={recoveryEmail} action={t("profile.update")} onAction={() => setRecoveryOpen(true)} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">{t("profile.effective")}</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ROLES.slice(0, 3).map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-gradient-brand-soft px-3 py-2">
              <div className="text-sm font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.permissions.length} {t("users.permissions")}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AvatarDialog
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        currentInitials={initials(user.name)}
        avatarSrc={avatarSrc}
        onSave={(src) => {
          setAvatarSrc(src);
          if (session) {
            signIn({
              ...session,
              user: {
                ...session.user,
                avatar: src ?? undefined,
              },
            });
          }
        }}
      />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <TwoFADialog open={tfaOpen} onClose={() => setTfaOpen(false)} enabled={tfaEnabled} onToggle={setTfaEnabled} session={session} />
      <RecoveryEmailDialog open={recoveryOpen} onClose={() => setRecoveryOpen(false)} current={recoveryEmail} onSave={setRecoveryEmail} />
    </div>
  );
}

function Field({ label, ...rest }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...rest} />
    </div>
  );
}

function SecurityRow({ icon: Icon, title, sub, action, badge, onAction }: { icon: React.ElementType; title: string; sub: string; action: string; badge?: string; onAction: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-medium">{title}{badge && <Badge variant="outline" className="font-normal">{badge}</Badge>}</div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>
      <Button variant="ghost" size="sm" onClick={onAction}>{action}</Button>
    </div>
  );
}
