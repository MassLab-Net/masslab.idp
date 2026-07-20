import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Building2, Copy, Eye, EyeOff, KeyRound, Loader2, Mail, MoreHorizontal, Plus, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusPill, statusVariant } from "@/components/status-pill";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { identityFetch, type CommandResult, type CreateTenantResult, type SystemTenantDto } from "@/lib/identity-api";

export const Route = createFileRoute("/admin/tenant/organizations")({
  head: () => ({ meta: [{ title: "Organizations — MassLab IAM" }] }),
  component: Organizations,
});

function Organizations() {
  const { t } = useI18n();
  const { session, user } = useAuth();
  const [orgs, setOrgs] = useState<SystemTenantDto[]>([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SystemTenantDto | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [hostName, setHostName] = useState("");
  const [rootEmail, setRootEmail] = useState("");
  const [rootDisplayName, setRootDisplayName] = useState("");
  const [rootPassword, setRootPassword] = useState("");
  const [createdTenantCredentials, setCreatedTenantCredentials] = useState<CreateTenantResult | null>(null);
  const [showCreatedPassword, setShowCreatedPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [busyTenantId, setBusyTenantId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"toggle" | "delete" | null>(null);

  useEffect(() => {
    if (!session) return;
    void loadOrganizations(session, setOrgs, setAccessDenied);
  }, [session]);

  const filtered = useMemo(
    () => orgs.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()) || o.slug.toLowerCase().includes(q.toLowerCase())),
    [orgs, q],
  );

  if (!session) {
    return null;
  }

  if (!user?.isSystemAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("org.title")}
          subtitle="Only system administrators can access organization management."
        />
        <Card className="border-border shadow-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Organization management requires a system administrator account.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accessDenied || !user.isSystemDefaultTenant) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("org.title")}
          subtitle="Only the default system tenant can manage tenant organizations."
        />
        <Card className="border-border shadow-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Switch to the default system tenant before managing organizations.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("org.title")}
        subtitle={t("org.subtitle")}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" disabled={isCreating || !!busyTenantId}>
                <Plus className="mr-1.5 h-4 w-4" /> {t("org.new")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("org.create")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>{t("org.name")}</Label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Corporation" disabled={isCreating} /></div>
                <div className="space-y-1.5"><Label>{t("org.subdomain")}</Label><Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="acme" disabled={isCreating} /></div>
                <div className="space-y-1.5"><Label>Host name</Label><Input value={hostName} onChange={(event) => setHostName(event.target.value)} placeholder="acme.localhost" disabled={isCreating} /></div>
                <div className="space-y-1.5"><Label>Root email</Label><Input type="email" value={rootEmail} onChange={(event) => setRootEmail(event.target.value)} placeholder="admin@acme.local" disabled={isCreating} /></div>
                <div className="space-y-1.5"><Label>Root display name</Label><Input value={rootDisplayName} onChange={(event) => setRootDisplayName(event.target.value)} placeholder="Acme Root Admin" disabled={isCreating} /></div>
                <div className="space-y-1.5">
                  <Label>Root password</Label>
                  <Input type="password" value={rootPassword} onChange={(event) => setRootPassword(event.target.value)} placeholder="Leave blank to auto-generate" disabled={isCreating} />
                  <p className="text-xs text-muted-foreground">Leave blank to auto-generate a strong password.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>{t("common.cancel")}</Button>
                <Button
                  className="bg-gradient-brand text-primary-foreground"
                  disabled={isCreating}
                  onClick={async () => {
                    setIsCreating(true);
                    try {
                      const result = await identityFetch<CreateTenantResult>(session, "/api/admin/system/tenants", {
                        method: "POST",
                        body: JSON.stringify({ name, slug, hostName, rootEmail, rootDisplayName, rootPassword }),
                      });
                      setCreatedTenantCredentials(result);
                      setShowCreatedPassword(false);
                      setOpen(false);
                      setName("");
                      setSlug("");
                      setHostName("");
                      setRootEmail("");
                      setRootDisplayName("");
                      setRootPassword("");
                      toast.success(t("org.created"));
                      await loadOrganizations(session, setOrgs, setAccessDenied);
                    } catch (reason: unknown) {
                      toast.error(reason instanceof Error ? reason.message : "Unable to create the organization.");
                    } finally {
                      setIsCreating(false);
                    }
                  }}
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.create")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: t("org.stat.total"), v: orgs.length },
          { l: t("org.stat.ent"), v: orgs.filter((o) => o.isActive).length },
          { l: t("org.stat.active"), v: orgs.filter((o) => o.isActive).length.toLocaleString() },
          { l: t("org.stat.suspended"), v: orgs.filter((o) => !o.isActive).length },
        ].map((item) => (
          <Card key={item.l} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{item.l}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">{item.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {createdTenantCredentials?.succeeded && createdTenantCredentials.rootEmail && createdTenantCredentials.rootPassword ? (
        <Card className="border-emerald-200 bg-emerald-50/60 shadow-card dark:border-emerald-900/40 dark:bg-emerald-950/10">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Tenant created successfully</div>
                <div className="mt-1 text-sm text-muted-foreground">Root credentials are shown once here. Copy them now.</div>
              </div>
              {createdTenantCredentials.passwordGenerated ? (
                <StatusPill variant={statusVariant("Pending")}>Generated password</StatusPill>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/80 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Root email</div>
                <div className="mt-2 font-mono text-sm">{createdTenantCredentials.rootEmail}</div>
              </div>
              <div className="rounded-xl border border-border bg-background/80 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Root password</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="font-mono text-sm">
                    {showCreatedPassword ? createdTenantCredentials.rootPassword : "••••••••••••"}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setShowCreatedPassword((value) => !value)}
                  >
                    {showCreatedPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(`Email: ${createdTenantCredentials.rootEmail}\nPassword: ${createdTenantCredentials.rootPassword}`);
                  toast.success("Credentials copied.");
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy credentials
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(createdTenantCredentials.rootEmail ?? "");
                  toast.success("Root email copied.");
                }}
              >
                <Mail className="mr-2 h-4 w-4" /> Copy email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(createdTenantCredentials.rootPassword ?? "");
                  toast.success("Root password copied.");
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Copy password
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border shadow-card">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("org.search")} className="h-9 pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("org.col.org")}</TableHead>
              <TableHead>{t("org.col.plan")}</TableHead>
              <TableHead>{t("org.col.members")}</TableHead>
              <TableHead>{t("org.col.status")}</TableHead>
              <TableHead>{t("org.col.created")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft text-primary"><Building2 className="h-4 w-4" /></div>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <code className="text-xs text-muted-foreground">{org.primaryHostName ?? `${org.slug}.localhost`}</code>
                    </div>
                  </div>
                </TableCell>
                <TableCell><StatusPill variant={statusVariant(org.isActive ? "Business" : "Suspended")}>{org.slug}</StatusPill></TableCell>
                <TableCell className="font-medium">-</TableCell>
                <TableCell><StatusPill variant={statusVariant(org.isActive ? "Active" : "Suspended")}>{org.status}</StatusPill></TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isCreating || busyTenantId === org.id}>
                        {busyTenantId === org.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={async () => {
                          if (org.isSystemDefault) {
                            return;
                          }

                          setBusyTenantId(org.id);
                          setBusyAction("toggle");
                          try {
                            await identityFetch<CommandResult>(session, `/api/admin/system/tenants/${org.id}/toggle`, { method: "POST" });
                            toast.success("Organization status updated.");
                            await loadOrganizations(session, setOrgs, setAccessDenied);
                          } catch (reason: unknown) {
                            toast.error(reason instanceof Error ? reason.message : "Unable to update the organization.");
                          } finally {
                            setBusyTenantId(null);
                            setBusyAction(null);
                          }
                        }}
                        disabled={org.isSystemDefault || isCreating || !!busyTenantId}
                      >
                        {org.isSystemDefault
                          ? "Default tenant"
                          : busyTenantId === org.id && busyAction === "toggle"
                            ? "Updating status..."
                            : "Toggle status"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={org.isSystemDefault || isCreating || !!busyTenantId}
                        onClick={() => setDeleteTarget(org)}
                      >
                        {org.isSystemDefault ? "Default tenant" : t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("org.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("org.deleteDesc")}{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? ""}</span>.
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                This performs a soft delete: the tenant is marked <code>Deleted</code>, users are disabled, tenant apps/providers are disabled, and audit data is preserved.
                The action is blocked while active sessions still exist.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyAction === "delete"}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteTarget) {
                  return;
                }

                setBusyTenantId(deleteTarget.id);
                setBusyAction("delete");
                try {
                  await identityFetch<CommandResult>(session, `/api/admin/system/tenants/${deleteTarget.id}`, { method: "DELETE" });
                  toast.success("Organization archived.");
                  setDeleteTarget(null);
                  await loadOrganizations(session, setOrgs, setAccessDenied);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to archive the organization.");
                } finally {
                  setBusyTenantId(null);
                  setBusyAction(null);
                }
              }}
            >
              {busyAction === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

async function loadOrganizations(
  session: Parameters<typeof identityFetch<SystemTenantDto[]>>[0],
  setOrgs: (orgs: SystemTenantDto[]) => void,
  setAccessDenied: (value: boolean) => void,
) {
  try {
    const organizations = await identityFetch<SystemTenantDto[]>(session, "/api/admin/system/tenants");
    setOrgs(organizations);
    setAccessDenied(false);
  } catch (reason: unknown) {
    const message = reason instanceof Error ? reason.message : "";
    if (message === "Your admin session is no longer authorized.") {
      setAccessDenied(true);
      setOrgs([]);
      return;
    }

    throw reason;
  }
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
