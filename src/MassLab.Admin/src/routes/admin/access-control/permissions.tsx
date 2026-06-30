import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { KeyRound, Layers, MoreHorizontal, Plus, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { identityFetch, type CommandResult, type TenantPermissionDto, type TenantRolesDto } from "@/lib/identity-api";

export const Route = createFileRoute("/admin/access-control/permissions")({
  head: () => ({ meta: [{ title: "Permissions — MassLab IAM" }] }),
  component: PermissionsPage,
});

type PermissionEditor = {
  id?: string;
  name: string;
  category: string;
  description: string;
};

function PermissionsPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [permissions, setPermissions] = useState<TenantPermissionDto[]>([]);
  const [roleMappings, setRoleMappings] = useState<Record<string, string[]>>({});
  const [activeModule, setActiveModule] = useState("");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<PermissionEditor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TenantPermissionDto | null>(null);

  useEffect(() => {
    if (!session) return;
    void loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
  }, [session]);

  const modules = useMemo(() => {
    const grouped = permissions.reduce<Record<string, TenantPermissionDto[]>>((accumulator, permission) => {
      const key = permission.category || "ungrouped";
      accumulator[key] = [...(accumulator[key] ?? []), permission];
      return accumulator;
    }, {});

    return Object.entries(grouped).map(([id, items]) => ({ id, name: id, permissions: items }));
  }, [permissions]);

  const current = modules.find((module) => module.id === activeModule) ?? modules[0] ?? { id: "", name: "", permissions: [] as TenantPermissionDto[] };
  const filteredPermissions = current.permissions.filter((permission) => !q || permission.name.toLowerCase().includes(q.toLowerCase()) || permission.description?.toLowerCase().includes(q.toLowerCase()));

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("perms.title")}
        subtitle={t("perms.subtitle")}
        action={
          <Button
            onClick={() => setEditing({ name: "", category: activeModule || modules[0]?.id || "", description: "" })}
            className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <Plus className="mr-1.5 h-4 w-4" /> {t("perms.addPerm")}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: t("perms.stat.total"), v: permissions.length },
          { l: t("perms.stat.modules"), v: modules.length },
          { l: t("perms.stat.used"), v: Object.values(roleMappings).reduce((sum, names) => sum + names.length, 0) },
          { l: t("perms.stat.coverage"), v: "100%" },
        ].map((item) => (
          <Card key={item.l} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{item.l}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">{item.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="border-border shadow-card lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> {t("perms.modules")}
            </div>
          </div>
          <div className="p-2">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                  module.id === current.id ? "bg-gradient-brand-soft font-semibold text-foreground" : "hover:bg-accent",
                )}
              >
                <span>{module.name}</span>
                <Badge variant="outline" className="font-normal">{module.permissions.length}</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-border shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><KeyRound className="h-4 w-4" /></div>
              <div><div className="font-semibold">{current.name}</div><div className="text-xs text-muted-foreground">{current.permissions.length} {t("perms.inModule")}</div></div>
            </div>
            <div className="relative w-64 max-w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("common.search")} className="h-9 pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("perms.col.perm")}</TableHead>
                <TableHead>{t("perms.col.id")}</TableHead>
                <TableHead>{t("perms.col.usedBy")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell><code className="text-xs text-muted-foreground">{permission.name}</code></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(roleMappings[permission.id] ?? []).map((roleName) => <Badge key={roleName} variant="secondary" className="font-normal">{roleName}</Badge>)}
                      {(roleMappings[permission.id] ?? []).length === 0 && <span className="text-xs text-muted-foreground">{t("perms.unassigned")}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditing({
                            id: permission.id,
                            name: permission.name,
                            category: permission.category,
                            description: permission.description ?? "",
                          })}
                        >
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(permission)}>{t("common.delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? t("common.edit") : t("common.create")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("perms.col.perm")}</Label><Input value={editing?.name ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, name: event.target.value } : current)} /></div>
            <div className="space-y-1.5"><Label>Category</Label><Input value={editing?.category ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, category: event.target.value } : current)} /></div>
            <div className="space-y-1.5"><Label>{t("roles.description")}</Label><Input value={editing?.description ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, description: event.target.value } : current)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              onClick={async () => {
                if (!editing) return;

                try {
                  if (editing.id) {
                    await identityFetch<CommandResult>(session, `/api/admin/tenant/permissions/${editing.id}/edit`, {
                      method: "POST",
                      body: JSON.stringify({
                        name: editing.name,
                        category: editing.category,
                        description: editing.description,
                      }),
                    });
                  } else {
                    await identityFetch<CommandResult>(session, "/api/admin/tenant/permissions", {
                      method: "POST",
                      body: JSON.stringify({
                        name: editing.name,
                        category: editing.category,
                        description: editing.description,
                      }),
                    });
                  }

                  toast.success(editing.id ? "Permission updated." : "Permission created.");
                  setEditing(null);
                  await loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to save the permission.");
                }
              }}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              Remove permission <span className="font-medium text-foreground">{deleteTarget?.name ?? ""}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteTarget) return;

                try {
                  await identityFetch<CommandResult>(session, `/api/admin/tenant/permissions/${deleteTarget.id}/delete`, { method: "POST" });
                  toast.success("Permission deleted.");
                  setDeleteTarget(null);
                  await loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to delete the permission.");
                }
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

async function loadPermissions(
  session: Parameters<typeof identityFetch<TenantPermissionDto[]>>[0],
  setPermissions: (permissions: TenantPermissionDto[]) => void,
  setRoleMappings: (value: Record<string, string[]>) => void,
  setActiveModule: Dispatch<SetStateAction<string>>,
) {
  const [permissionsResult, rolesResult] = await Promise.all([
    identityFetch<TenantPermissionDto[]>(session, "/api/admin/tenant/permissions?q=&sort=category&dir=asc"),
    identityFetch<TenantRolesDto>(session, "/api/admin/tenant/roles?q=&sort=name&dir=asc"),
  ]);

  const roleNameMap = Object.fromEntries(rolesResult.roles.map((role) => [role.id, role.name]));
  const mappings: Record<string, string[]> = {};
  for (const permission of permissionsResult) {
    mappings[permission.id] = [];
  }

  for (const [roleId, permissionIds] of Object.entries(rolesResult.assignedPermissionIds)) {
    for (const permissionId of permissionIds) {
      mappings[permissionId] = [...(mappings[permissionId] ?? []), roleNameMap[roleId] ?? roleId];
    }
  }

  setPermissions(permissionsResult);
  setRoleMappings(mappings);
  if (permissionsResult.length > 0) {
    setActiveModule((current) => current || permissionsResult[0].category);
  }
}
