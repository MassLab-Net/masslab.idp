import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { identityFetch, type CommandResult, type TenantPermissionDto, type TenantRoleDto, type TenantRolesDto, type TenantUsersDto } from "@/lib/identity-api";

export const Route = createFileRoute("/admin/access-control/roles")({
  head: () => ({ meta: [{ title: "Roles — MassLab IAM" }] }),
  component: RolesPage,
});

type RoleEditorState = {
  id?: string;
  name: string;
  description: string;
};

function RolesPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [q, setQ] = useState("");
  const [roles, setRoles] = useState<TenantRoleDto[]>([]);
  const [permissions, setPermissions] = useState<TenantPermissionDto[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<Record<string, string[]>>({});
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<RoleEditorState | null>(null);
  const [assigningRoleId, setAssigningRoleId] = useState<string | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  useEffect(() => {
    if (!session) return;
    void loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
  }, [session]);

  const filtered = useMemo(
    () => roles.filter((role) => !q || role.name.toLowerCase().includes(q.toLowerCase()) || role.description.toLowerCase().includes(q.toLowerCase())),
    [roles, q],
  );

  const permissionGroups = useMemo(() => {
    return permissions.reduce<Record<string, TenantPermissionDto[]>>((groups, permission) => {
      const key = permission.category || "Ungrouped";
      groups[key] = [...(groups[key] ?? []), permission];
      return groups;
    }, {});
  }, [permissions]);

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("roles.title")}
        subtitle={t("roles.subtitle")}
        action={
          <Button onClick={() => setEditing({ name: "", description: "" })} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> {t("roles.new")}
          </Button>
        }
      />

      <div className="max-w-sm">
        <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search roles..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((role) => (
          <Card key={role.id} className="group relative overflow-hidden border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditing({ id: role.id, name: role.name, description: role.description })}>{t("common.edit")}</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAssigningRoleId(role.id);
                        setSelectedPermissionIds(assignedPermissionIds[role.id] ?? []);
                      }}
                    >
                      {t("roles.permissions")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={async () => {
                        try {
                          await identityFetch<CommandResult>(session, `/api/admin/tenant/roles/${role.id}/delete`, { method: "POST" });
                          toast.success(t("roles.deleted"));
                          await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
                        } catch (reason: unknown) {
                          toast.error(reason instanceof Error ? reason.message : "Unable to delete the role.");
                        }
                      }}
                    >
                      {t("common.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="text-xs text-muted-foreground">{t("roles.permissions")}</div>
                  <div className="font-semibold">{(assignedPermissionIds[role.id] ?? []).length}</div>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><UsersIcon className="h-3 w-3" />{t("roles.users")}</div>
                  <div className="font-semibold">{userCounts[role.id] ?? 0}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {(assignedPermissionIds[role.id] ?? []).slice(0, 4).map((permissionId) => {
                  const permission = permissions.find((item) => item.id === permissionId);
                  return permission ? <Badge key={permissionId} variant="secondary" className="font-normal">{permission.category}</Badge> : null;
                })}
              </div>
              <Button variant="outline" className="mt-5 w-full" onClick={() => {
                setAssigningRoleId(role.id);
                setSelectedPermissionIds(assignedPermissionIds[role.id] ?? []);
              }}>
                {t("roles.manage")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? t("roles.edit") : t("roles.create")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("roles.name")}</Label><Input value={editing?.name ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, name: event.target.value } : current)} /></div>
            <div className="space-y-1.5"><Label>{t("roles.description")}</Label><Textarea rows={3} value={editing?.description ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, description: event.target.value } : current)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              onClick={async () => {
                if (!editing) return;

                try {
                  if (editing.id) {
                    await identityFetch<CommandResult>(session, `/api/admin/tenant/roles/${editing.id}/edit`, {
                      method: "POST",
                      body: JSON.stringify({ name: editing.name, description: editing.description }),
                    });
                  } else {
                    await identityFetch<CommandResult>(session, "/api/admin/tenant/roles", {
                      method: "POST",
                      body: JSON.stringify({ name: editing.name, description: editing.description }),
                    });
                  }

                  toast.success(editing.id ? t("roles.updated") : t("roles.created"));
                  setEditing(null);
                  await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to save the role.");
                }
              }}
            >
              {t("roles.saveBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assigningRoleId} onOpenChange={(open) => !open && setAssigningRoleId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("roles.permissions")}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto py-2">
            {Object.entries(permissionGroups).map(([group, items]) => (
              <div key={group} className="space-y-2 rounded-lg border border-border p-3">
                <div className="text-sm font-semibold">{group}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {items.map((permission) => {
                    const checked = selectedPermissionIds.includes(permission.id);
                    return (
                      <label key={permission.id} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value: boolean | "indeterminate") => {
                            setSelectedPermissionIds((current) => value === true ? [...current, permission.id] : current.filter((item) => item !== permission.id));
                          }}
                        />
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description || permission.category}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningRoleId(null)}>{t("common.cancel")}</Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              onClick={async () => {
                if (!assigningRoleId) return;

                try {
                  await identityFetch<CommandResult>(session, `/api/admin/tenant/roles/${assigningRoleId}/permissions`, {
                    method: "POST",
                    body: JSON.stringify({ permissionIds: selectedPermissionIds }),
                  });
                  toast.success("Role permissions updated.");
                  setAssigningRoleId(null);
                  await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to update role permissions.");
                }
              }}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function loadRoles(
  session: Parameters<typeof identityFetch<TenantRolesDto>>[0],
  setRoles: (roles: TenantRoleDto[]) => void,
  setPermissions: (permissions: TenantPermissionDto[]) => void,
  setAssignedPermissionIds: (value: Record<string, string[]>) => void,
  setUserCounts: (counts: Record<string, number>) => void,
) {
  const [rolesResult, usersResult] = await Promise.all([
    identityFetch<TenantRolesDto>(session, "/api/admin/tenant/roles?q=&sort=name&dir=asc"),
    identityFetch<TenantUsersDto>(session, "/api/admin/tenant/users?q=&sort=email&dir=asc"),
  ]);

  const counts = Object.fromEntries(rolesResult.roles.map((role) => [role.id, 0]));
  for (const roleIds of Object.values(usersResult.assignedRoleIds)) {
    for (const roleId of roleIds) {
      counts[roleId] = (counts[roleId] ?? 0) + 1;
    }
  }

  setRoles(rolesResult.roles);
  setPermissions(rolesResult.permissions);
  setAssignedPermissionIds(rolesResult.assignedPermissionIds);
  setUserCounts(counts);
}
