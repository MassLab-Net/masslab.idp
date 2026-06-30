import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { initials } from "@/components/app-sidebar";
import { StatusPill, statusVariant } from "@/components/status-pill";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { identityFetch, type CommandResult, type TenantRoleDto, type TenantUsersDto, type TenantUserDto } from "@/lib/identity-api";

export const Route = createFileRoute("/admin/access-control/users")({
  head: () => ({ meta: [{ title: "Users — MassLab IAM" }] }),
  component: UsersPage,
});

type UserEditorState = {
  id?: string;
  email: string;
  displayName: string;
  password: string;
  isEnabled: boolean;
  isTenantAdmin: boolean;
};

function UsersPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<TenantUserDto[]>([]);
  const [roles, setRoles] = useState<TenantRoleDto[]>([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState<Record<string, string[]>>({});
  const [editing, setEditing] = useState<UserEditorState | null>(null);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (!session) return;
    void loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
  }, [session]);

  const filtered = useMemo(
    () => users.filter((user) =>
      !q
      || user.displayName.toLowerCase().includes(q.toLowerCase())
      || (user.email ?? "").toLowerCase().includes(q.toLowerCase())),
    [users, q],
  );

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        action={
          <Button
            onClick={() => setEditing({ email: "", displayName: "", password: "", isEnabled: true, isTenantAdmin: false })}
            className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <Plus className="mr-1.5 h-4 w-4" /> {t("users.invite")}
          </Button>
        }
      />

      <Card className="border-border shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("users.search")} className="h-9 pl-9" />
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} {t("common.of")} {users.length}</div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("users.col.user")}</TableHead>
              <TableHead>{t("users.col.roles")}</TableHead>
              <TableHead>{t("users.col.status")}</TableHead>
              <TableHead>{t("users.col.org")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => {
              const userRoleIds = assignedRoleIds[user.id] ?? [];
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">{initials(user.displayName)}</div>
                      <div>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {userRoleIds.map((roleId) => {
                        const role = roles.find((item) => item.id === roleId);
                        return role ? <Badge key={roleId} variant="secondary" className="font-normal">{role.name}</Badge> : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell><StatusPill variant={statusVariant(user.isEnabled ? "Active" : "Disabled")}>{user.isEnabled ? "Active" : "Disabled"}</StatusPill></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.isSystemAdmin ? "System" : user.isTenantAdmin ? "Tenant" : "User"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditing({
                            id: user.id,
                            email: user.email ?? "",
                            displayName: user.displayName,
                            password: "",
                            isEnabled: user.isEnabled,
                            isTenantAdmin: user.isTenantAdmin,
                          })}
                        >
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setAssigningUserId(user.id);
                            setSelectedRoleIds(userRoleIds);
                          }}
                        >
                          {t("users.tab.roles")}
                        </DropdownMenuItem>
                        {!user.isEnabled && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing({
                                id: user.id,
                                email: user.email ?? "",
                                displayName: user.displayName,
                                password: "",
                                isEnabled: true,
                                isTenantAdmin: user.isTenantAdmin,
                              });
                            }}
                          >
                            Enable
                          </DropdownMenuItem>
                        )}
                        {user.isEnabled && (
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await identityFetch<CommandResult>(session, `/api/admin/tenant/users/${user.id}/disable`, { method: "POST" });
                                toast.success("User disabled.");
                                await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
                              } catch (reason: unknown) {
                                toast.error(reason instanceof Error ? reason.message : "Unable to disable the user.");
                              }
                            }}
                          >
                            Disable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={async () => {
                            try {
                              await identityFetch<CommandResult>(session, `/api/admin/tenant/users/${user.id}/delete`, { method: "POST" });
                              toast.success(t("users.deleted"));
                              await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
                            } catch (reason: unknown) {
                              toast.error(reason instanceof Error ? reason.message : "Unable to delete the user.");
                            }
                          }}
                        >
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? t("users.editTitle") : t("users.inviteTitle")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("users.fullName")}</Label><Input value={editing?.displayName ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, displayName: event.target.value } : current)} /></div>
            <div className="space-y-1.5"><Label>{t("users.email")}</Label><Input value={editing?.email ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, email: event.target.value } : current)} /></div>
            {!editing?.id && (
              <div className="space-y-1.5"><Label>{t("login.password")}</Label><Input type="password" value={editing?.password ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, password: event.target.value } : current)} /></div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={editing?.isEnabled ?? true} onCheckedChange={(checked) => setEditing((current) => current ? { ...current, isEnabled: checked === true } : current)} />
              Enabled
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={editing?.isTenantAdmin ?? false} onCheckedChange={(checked) => setEditing((current) => current ? { ...current, isTenantAdmin: checked === true } : current)} />
              Tenant administrator
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              onClick={async () => {
                if (!editing) return;

                try {
                  if (editing.id) {
                    await identityFetch<CommandResult>(session, `/api/admin/tenant/users/${editing.id}/edit`, {
                      method: "POST",
                      body: JSON.stringify({
                        email: editing.email,
                        displayName: editing.displayName,
                        isEnabled: editing.isEnabled,
                        isTenantAdmin: editing.isTenantAdmin,
                      }),
                    });
                  } else {
                    await identityFetch<CommandResult>(session, "/api/admin/tenant/users", {
                      method: "POST",
                      body: JSON.stringify({
                        email: editing.email,
                        displayName: editing.displayName,
                        password: editing.password,
                        isTenantAdmin: editing.isTenantAdmin,
                      }),
                    });
                  }

                  toast.success(editing.id ? t("users.updated") : t("users.invited"));
                  setEditing(null);
                  await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to save the user.");
                }
              }}
            >
              {editing?.id ? t("common.save") : t("users.invite")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assigningUserId} onOpenChange={(open) => !open && setAssigningUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("users.tab.roles")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {roles.map((role) => {
              const checked = selectedRoleIds.includes(role.id);
              return (
                <label key={role.id} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => {
                      setSelectedRoleIds((current) => value === true ? [...current, role.id] : current.filter((item) => item !== role.id));
                    }}
                  />
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningUserId(null)}>{t("common.cancel")}</Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              onClick={async () => {
                if (!assigningUserId) return;

                try {
                  await identityFetch<CommandResult>(session, `/api/admin/tenant/users/${assigningUserId}/roles`, {
                    method: "POST",
                    body: JSON.stringify({ roleIds: selectedRoleIds }),
                  });
                  toast.success("User roles updated.");
                  setAssigningUserId(null);
                  await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
                } catch (reason: unknown) {
                  toast.error(reason instanceof Error ? reason.message : "Unable to update user roles.");
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

async function loadUsers(
  session: Parameters<typeof identityFetch<TenantUsersDto>>[0],
  setUsers: (users: TenantUserDto[]) => void,
  setRoles: (roles: TenantRoleDto[]) => void,
  setAssignedRoleIds: (value: Record<string, string[]>) => void,
) {
  const result = await identityFetch<TenantUsersDto>(session, "/api/admin/tenant/users?q=&sort=email&dir=asc");
  setUsers(result.users);
  setRoles(result.roles);
  setAssignedRoleIds(result.assignedRoleIds);
}
