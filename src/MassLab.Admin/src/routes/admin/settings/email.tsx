import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { identityFetch } from "@/lib/identity-api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/email")({ component: EmailSettingsPage });

function EmailSettingsPage() {
  const { session } = useAuth();
  const [provider, setProvider] = useState("Resend"); const [fromEmail, setFromEmail] = useState(""); const [fromDisplayName, setFromDisplayName] = useState(""); const [resendApiKey, setResendApiKey] = useState(""); const [passwordResetTemplate, setPasswordResetTemplate] = useState("identity-password-reset"); const [emailVerificationTemplate, setEmailVerificationTemplate] = useState("identity-email-verification");
  const save = async () => { try { await identityFetch(session, "/api/admin/tenant/smtp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, host: "", port: 587, useTls: true, fromEmail, fromDisplayName, resendApiKey: provider === "Resend" ? resendApiKey : undefined, passwordResetTemplate, emailVerificationTemplate }) }); toast.success("Email settings saved"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save email settings"); } };
  return <main className="space-y-6 p-6"><div><h1 className="text-2xl font-semibold">Email delivery</h1><p className="text-muted-foreground">Configure the active provider and templates for this tenant.</p></div><div className="grid max-w-2xl gap-4 rounded-lg border p-5"><div><Label>Provider</Label><select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 h-10 w-full rounded-md border bg-background px-3"><option>Resend</option><option>Smtp</option><option>Ses</option></select></div><div><Label>From email</Label><Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} /></div><div><Label>From display name</Label><Input value={fromDisplayName} onChange={(e) => setFromDisplayName(e.target.value)} /></div>{provider === "Resend" && <div><Label>Resend API key</Label><Input type="password" value={resendApiKey} onChange={(e) => setResendApiKey(e.target.value)} /></div>}<div><Label>Password reset template ID / alias</Label><Input value={passwordResetTemplate} onChange={(e) => setPasswordResetTemplate(e.target.value)} /></div><div><Label>Email verification template ID / alias</Label><Input value={emailVerificationTemplate} onChange={(e) => setEmailVerificationTemplate(e.target.value)} /></div><Button onClick={save}>Save settings</Button></div></main>;
}
