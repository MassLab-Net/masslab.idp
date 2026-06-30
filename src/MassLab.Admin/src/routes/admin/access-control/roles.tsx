import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

import { ROLES, PERMISSION_MODULES, type Role } from "@/lib/mock-data";
import { PermissionTree } from "@/components/permission-tree";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/access-control/roles")({
  head: () => ({ meta: [{ title: "Roles — MassLab IAM" }] }),
  component: RolesPage,
});

function RolesPage() {
  const { t } = useI18n();
  const [roles, setRoles] = useState<Role[]>(ROLES);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("roles.title")}
        subtitle={t("roles.subtitle")}
        action={
          <Button onClick={() => setCreating(true)} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> {t("roles.new")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.id} className="group relative overflow-hidden border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{r.name}</h3>
                      {r.system && <Badge variant="outline" className="font-normal">{t("roles.system")}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditing(r)}>{t("common.edit")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDuplicateTarget(r)}>{t("roles.duplicate")}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" disabled={r.system} onClick={() => setDeleteTarget(r)}>{t("common.delete")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="text-xs text-muted-foreground">{t("roles.permissions")}</div>
                  <div className="font-semibold">{r.permissions.length}</div>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><UsersIcon className="h-3 w-3" />{t("roles.users")}</div>
                  <div className="font-semibold">{r.users}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {PERMISSION_MODULES.filter((m) => m.permissions.some((p) => r.permissions.includes(p.id))).slice(0, 4).map((m) => (
                  <Badge key={m.id} variant="secondary" className="font-normal">{m.name}</Badge>
                ))}
              </div>
              <Button variant="outline" className="mt-5 w-full" onClick={() => setEditing(r)}>{t("roles.manage")}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoleSheet
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        role={editing}
        onSave={(r) => { setRoles((s) => { const exists = s.find((x) => x.id === r.id); return exists ? s.map((x) => x.id === r.id ? r : x) : [...s, r]; }); }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("roles.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("roles.deleteDesc")}{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) return;
                setRoles((s) => s.filter((x) => x.id !== deleteTarget.id));
                toast.success(t("roles.deleted"));
                setDeleteTarget(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!duplicateTarget} onOpenChange={(open) => !open && setDuplicateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("roles.duplicateTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("roles.duplicateDesc")}{" "}
              <span className="font-medium text-foreground">{duplicateTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!duplicateTarget) return;
                const copy: Role = {
                  ...duplicateTarget,
                  id: `role_${Date.now()}`,
                  name: `${duplicateTarget.name} Copy`,
                  system: false,
                };
                setRoles((s) => [...s, copy]);
                toast.success(t("roles.duplicated"));
                setDuplicateTarget(null);
              }}
            >
              {t("roles.duplicate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleSheet({ open, onClose, role, onSave }: { open: boolean; onClose: () => void; role: Role | null; onSave: (r: Role) => void }) {
  const { t } = useI18n();
  const [name, setName] = useState(role?.name ?? "");
  const [desc, setDesc] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<string[]>(role?.permissions ?? []);

  useMemo(() => { setName(role?.name ?? ""); setDesc(role?.description ?? ""); setPerms(role?.permissions ?? []); }, [role]);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">{role ? t("roles.edit") : t("roles.create")}</SheetTitle>
          <SheetDescription>{t("roles.editDesc")}</SheetDescription>
        </SheetHeader>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5"><Label>{t("roles.name")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{t("roles.slug")}</Label><Input value={name.toLowerCase().replace(/\s+/g, "_")} disabled /></div>
          </div>
          <div className="space-y-1.5"><Label>{t("roles.description")}</Label><Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>{t("roles.permissions")}</Label>
            <PermissionTree selected={perms} onChange={setPerms} readOnly={role?.system} />
            {role?.system && <p className="text-xs text-muted-foreground">{t("roles.systemLocked")}</p>}
          </div>
        </div>
        <SheetFooter className="mt-6 flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button className="bg-gradient-brand text-primary-foreground" onClick={() => {
            onSave({ id: role?.id ?? `role_${Date.now()}`, name, description: desc, permissions: perms, users: role?.users ?? 0, system: role?.system ?? false });
            toast.success(role ? t("roles.updated") : t("roles.created"));
            onClose();
          }}>{t("roles.saveBtn")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
