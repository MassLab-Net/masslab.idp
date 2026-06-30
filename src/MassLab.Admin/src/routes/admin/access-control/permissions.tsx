import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { PERMISSION_MODULES, ROLES, type PermissionModule } from "@/lib/mock-data";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/access-control/permissions")({
  head: () => ({ meta: [{ title: "Permissions — MassLab IAM" }] }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const { t } = useI18n();
  const [modules, setModules] = useState<PermissionModule[]>(PERMISSION_MODULES);
  const [activeModule, setActiveModule] = useState(PERMISSION_MODULES[0].id);
  const [q, setQ] = useState("");
  const [moduleDialog, setModuleDialog] = useState(false);
  const [permDialog, setPermDialog] = useState(false);
  const [newModName, setNewModName] = useState("");
  const [newModId, setNewModId] = useState("");
  const [newPermName, setNewPermName] = useState("");
  const [newPermId, setNewPermId] = useState("");
  const [editModuleTarget, setEditModuleTarget] = useState<PermissionModule | null>(null);
  const [editPermTarget, setEditPermTarget] = useState<{ moduleId: string; permId: string; name: string } | null>(null);
  const [deleteModuleTarget, setDeleteModuleTarget] = useState<PermissionModule | null>(null);
  const [deletePermTarget, setDeletePermTarget] = useState<{ moduleId: string; permId: string; name: string } | null>(null);
  const [editModName, setEditModName] = useState("");
  const [editModId, setEditModId] = useState("");
  const [editPermName, setEditPermName] = useState("");
  const [editPermId, setEditPermId] = useState("");

  const current = modules.find((m) => m.id === activeModule) ?? modules[0] ?? { id: "", name: "", permissions: [] as PermissionModule["permissions"] };
  const perms = current.permissions.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q.toLowerCase()));
  const rolesByPerm = (pid: string) => ROLES.filter((r) => r.permissions.includes(pid));
  const allModIds = new Set(modules.map((m) => m.id));
  const allPermIds = new Set(modules.flatMap((m) => m.permissions.map((p) => p.id)));

  const addModule = () => {
    const id = newModId.trim().toLowerCase().replace(/\s+/g, "_");
    if (!id || !newModName.trim()) return;
    if (allModIds.has(id)) { toast.error(t("perms.errExists")); return; }
    setModules((s) => [...s, { id, name: newModName.trim(), permissions: [] }]);
    setActiveModule(id);
    setNewModName(""); setNewModId(""); setModuleDialog(false);
    toast.success(t("perms.moduleCreated"));
  };

  const saveModule = () => {
    if (!editModuleTarget) return;
    const id = editModId.trim().toLowerCase().replace(/\s+/g, "_");
    const name = editModName.trim();
    if (!id || !name) return;
    if (id !== editModuleTarget.id && allModIds.has(id)) { toast.error(t("perms.errExists")); return; }
    setModules((s) => s.map((m) => {
      if (m.id !== editModuleTarget.id) return m;
      const updatedPermissions = m.permissions.map((p) => p.id.startsWith(`${m.id}.`) && id !== m.id
        ? { ...p, id: p.id.replace(`${m.id}.`, `${id}.`) }
        : p);
      return { ...m, id, name, permissions: updatedPermissions };
    }));
    setActiveModule(id);
    setEditModuleTarget(null);
    toast.success(t("perms.moduleUpdated"));
  };

  const addPerm = () => {
    const rawId = newPermId.trim().toLowerCase().replace(/\s+/g, "_");
    const id = rawId.startsWith(`${current.id}.`) ? rawId : `${current.id}.${rawId}`;
    if (!rawId || !newPermName.trim()) return;
    if (allPermIds.has(id)) { toast.error(t("perms.errExists")); return; }
    setModules((s) => s.map((m) => m.id === current.id ? { ...m, permissions: [...m.permissions, { id, name: newPermName.trim() }] } : m));
    setNewPermName(""); setNewPermId(""); setPermDialog(false);
    toast.success(t("perms.permCreated"));
  };

  const savePerm = () => {
    if (!editPermTarget) return;
    const nextIdRaw = editPermId.trim().toLowerCase().replace(/\s+/g, "_");
    const nextId = nextIdRaw.startsWith(`${editPermTarget.moduleId}.`) ? nextIdRaw : `${editPermTarget.moduleId}.${nextIdRaw}`;
    const nextName = editPermName.trim();
    if (!nextIdRaw || !nextName) return;
    if (nextId !== editPermTarget.permId && allPermIds.has(nextId)) { toast.error(t("perms.errExists")); return; }
    setModules((s) => s.map((m) => m.id === editPermTarget.moduleId ? {
      ...m,
      permissions: m.permissions.map((p) => p.id === editPermTarget.permId ? { ...p, id: nextId, name: nextName } : p),
    } : m));
    setEditPermTarget(null);
    toast.success(t("perms.permUpdated"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("perms.title")}
        subtitle={t("perms.subtitle")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModuleDialog(true)}><Plus className="mr-1.5 h-4 w-4" /> {t("perms.addModule")}</Button>
            <Button onClick={() => setPermDialog(true)} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"><Plus className="mr-1.5 h-4 w-4" /> {t("perms.addPerm")}</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: t("perms.stat.total"), v: modules.reduce((n, m) => n + m.permissions.length, 0) },
          { l: t("perms.stat.modules"), v: modules.length },
          { l: t("perms.stat.used"), v: ROLES.reduce((n, r) => n + r.permissions.length, 0) },
          { l: t("perms.stat.coverage"), v: "100%" },
        ].map((s) => (
          <Card key={s.l} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">{s.v}</div>
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
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setModuleDialog(true)}><Plus className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="p-2">
            {modules.map((m) => (
              <div key={m.id} className={cn("flex items-center gap-1 rounded-lg px-1 transition", m.id === activeModule ? "bg-gradient-brand-soft" : "")}>
                <button
                  onClick={() => setActiveModule(m.id)}
                  className={cn("flex flex-1 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition", m.id === activeModule ? "font-semibold text-foreground" : "hover:bg-accent")}
                >
                  <span>{m.name}</span>
                  <Badge variant="outline" className="font-normal">{m.permissions.length}</Badge>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditModuleTarget(m); setEditModName(m.name); setEditModId(m.id); }}>{t("common.edit")}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteModuleTarget(m)}>{t("common.delete")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><KeyRound className="h-4 w-4" /></div>
              <div><div className="font-semibold">{current.name}</div><div className="text-xs text-muted-foreground">{current.permissions.length} {t("perms.inModule")}</div></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64 max-w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="h-9 pl-9" />
              </div>
              <Button size="sm" variant="outline" onClick={() => setPermDialog(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> {t("perms.addPerm")}</Button>
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
              {perms.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><code className="text-xs text-muted-foreground">{p.id}</code></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rolesByPerm(p.id).map((r) => <Badge key={r.id} variant="secondary" className="font-normal">{r.name}</Badge>)}
                      {rolesByPerm(p.id).length === 0 && <span className="text-xs text-muted-foreground">{t("perms.unassigned")}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditPermTarget({ moduleId: current.id, permId: p.id, name: p.name }); setEditPermName(p.name); setEditPermId(p.id.slice(current.id.length + 1)); }}>{t("common.edit")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeletePermTarget({ moduleId: current.id, permId: p.id, name: p.name })}>{t("common.delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("perms.newModule")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("perms.moduleName")}</Label><Input value={newModName} onChange={(e) => setNewModName(e.target.value)} placeholder="Billing & Invoices" /></div>
            <div className="space-y-1.5"><Label>{t("perms.moduleId")}</Label><Input value={newModId} onChange={(e) => setNewModId(e.target.value)} placeholder="billing" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialog(false)}>{t("common.cancel")}</Button>
            <Button className="bg-gradient-brand text-primary-foreground" onClick={addModule}>{t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={permDialog} onOpenChange={setPermDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("perms.newPerm")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="rounded-lg border border-border bg-gradient-brand-soft px-3 py-2 text-sm">
              <span className="text-muted-foreground">{t("perms.modules")}: </span><span className="font-semibold">{current.name}</span>
            </div>
            <div className="space-y-1.5"><Label>{t("perms.permName")}</Label><Input value={newPermName} onChange={(e) => setNewPermName(e.target.value)} placeholder="View invoices" /></div>
            <div className="space-y-1.5">
              <Label>{t("perms.permId")}</Label>
              <div className="flex items-center rounded-md border border-input bg-card overflow-hidden">
                <span className="border-r border-input px-3 text-sm text-muted-foreground">{current.id}.</span>
                <Input value={newPermId} onChange={(e) => setNewPermId(e.target.value)} placeholder="invoices.read" className="border-0 focus-visible:ring-0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermDialog(false)}>{t("common.cancel")}</Button>
            <Button className="bg-gradient-brand text-primary-foreground" onClick={addPerm}>{t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editModuleTarget} onOpenChange={(open) => !open && setEditModuleTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("perms.editModule")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("perms.moduleName")}</Label><Input value={editModName} onChange={(e) => setEditModName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{t("perms.moduleId")}</Label><Input value={editModId} onChange={(e) => setEditModId(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModuleTarget(null)}>{t("common.cancel")}</Button>
            <Button className="bg-gradient-brand text-primary-foreground" onClick={saveModule}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPermTarget} onOpenChange={(open) => !open && setEditPermTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("perms.editPerm")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5"><Label>{t("perms.permName")}</Label><Input value={editPermName} onChange={(e) => setEditPermName(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>{t("perms.permId")}</Label>
              <div className="flex items-center rounded-md border border-input bg-card overflow-hidden">
                <span className="border-r border-input px-3 text-sm text-muted-foreground">{editPermTarget?.moduleId ?? current.id}.</span>
                <Input value={editPermId} onChange={(e) => setEditPermId(e.target.value)} className="border-0 focus-visible:ring-0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPermTarget(null)}>{t("common.cancel")}</Button>
            <Button className="bg-gradient-brand text-primary-foreground" onClick={savePerm}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteModuleTarget} onOpenChange={(open) => !open && setDeleteModuleTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("perms.deleteModuleTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("perms.deleteModuleDesc")} <span className="font-medium text-foreground">{deleteModuleTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              if (!deleteModuleTarget) return;
              const moduleId = deleteModuleTarget.id;
              const nextModules = modules.filter((m) => m.id !== moduleId);
              setModules(nextModules);
              setActiveModule((currId) => (currId === moduleId ? nextModules[0]?.id ?? "" : currId));
              toast.success(t("perms.moduleDeleted"));
              setDeleteModuleTarget(null);
            }}>{t("common.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletePermTarget} onOpenChange={(open) => !open && setDeletePermTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("perms.deletePermTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("perms.deletePermDesc")} <span className="font-medium text-foreground">{deletePermTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              if (!deletePermTarget) return;
              const { moduleId, permId } = deletePermTarget;
              setModules((s) => s.map((m) => m.id === moduleId ? { ...m, permissions: m.permissions.filter((p) => p.id !== permId) } : m));
              toast.success(t("perms.permDeleted"));
              setDeletePermTarget(null);
            }}>{t("common.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
