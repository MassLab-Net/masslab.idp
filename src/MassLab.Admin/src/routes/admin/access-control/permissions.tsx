import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ChevronRight, KeyRound, Layers, MoreHorizontal, Plus, Search } from "lucide-react";

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
import {
  buildPermissionTree,
  type PermissionTreeItem,
  type PermissionTreeNode,
} from "@/components/permission-tree";
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

const bootstrapPermissionNames = new Set([
  "tenants.manage",
  "users.manage",
  "roles.manage",
  "permissions.manage",
  "clients.manage",
  "providers.manage",
  "smtp.manage",
  "sessions.manage",
  "audit.read",
]);

function PermissionsPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [permissions, setPermissions] = useState<TenantPermissionDto[]>([]);
  const [roleMappings, setRoleMappings] = useState<Record<string, string[]>>({});
  const [activeModule, setActiveModule] = useState("");
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<PermissionEditor | null>(null);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TenantPermissionDto | null>(null);

  useEffect(() => {
    if (!session) return;
    void loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
  }, [session]);

  const permissionItems = useMemo<PermissionTreeItem[]>(
    () =>
      permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        category: permission.category,
        description: permission.description,
      })),
    [permissions],
  );
  const modules = useMemo(() => {
    return buildPermissionTree(permissionItems);
  }, [permissionItems]);
  const allModuleIds = useMemo(() => flattenNodeIds(modules), [modules]);
  const moduleCount = allModuleIds.length;
  const current = useMemo(() => {
    return findTreeNode(modules, activeModule) ?? modules[0] ?? null;
  }, [activeModule, modules]);
  const currentPermissionIds = useMemo(
    () => new Set(current?.permissionIds ?? permissions.map((permission) => permission.id)),
    [current, permissions],
  );
  const currentPermissions = useMemo(
    () => permissions.filter((permission) => currentPermissionIds.has(permission.id)),
    [currentPermissionIds, permissions],
  );
  const filteredPermissions = useMemo(
    () =>
      currentPermissions.filter(
        (permission) =>
          !q ||
          permission.name.toLowerCase().includes(q.toLowerCase()) ||
          permission.category.toLowerCase().includes(q.toLowerCase()) ||
          permission.description?.toLowerCase().includes(q.toLowerCase()),
      ),
    [currentPermissions, q],
  );
  const normalizedEditor = useMemo(
    () =>
      editing
        ? {
            name: normalizePermissionPath(editing.name),
            category: normalizePermissionPath(editing.category),
          }
        : null,
    [editing],
  );
  const editorErrors = useMemo(
    () => validatePermissionEditor(editing, t),
    [editing, t],
  );
  const canSave = editorErrors.length === 0;

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
            onClick={() => {
              setSaveAttempted(false);
              setEditing({
                name: "",
                category: activeModule || modules[0]?.id || "",
                description: "",
              });
            }}
            className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <Plus className="mr-1.5 h-4 w-4" /> {t("perms.addPerm")}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: t("perms.stat.total"), v: permissions.length },
          { l: t("perms.stat.modules"), v: moduleCount },
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
          <div className="space-y-2 p-2">
            {modules.map((module) => (
              <PermissionModuleBranch
                key={module.id}
                node={module}
                activeModuleId={current?.id ?? ""}
                openModules={openModules}
                setOpenModules={setOpenModules}
                onSelect={setActiveModule}
              />
            ))}
          </div>
        </Card>

        <Card className="border-border shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><KeyRound className="h-4 w-4" /></div>
              <div>
                <div className="font-semibold">{current ? current.path.join(" / ") : t("perms.modules")}</div>
                <div className="text-xs text-muted-foreground">
                  {currentPermissions.length} {t("perms.inModule")}
                </div>
              </div>
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
                <TableHead>Category</TableHead>
                <TableHead>{t("perms.col.id")}</TableHead>
                <TableHead>{t("perms.col.usedBy")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>
                    <code className="text-xs text-muted-foreground">{permission.category}</code>
                  </TableCell>
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
                        {bootstrapPermissionNames.has(permission.name) ? (
                          <DropdownMenuItem disabled>Protected bootstrap permission</DropdownMenuItem>
                        ) : (
                          <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSaveAttempted(false);
                            setEditing({
                              id: permission.id,
                              name: permission.name,
                              category: permission.category,
                              description: permission.description ?? "",
                            });
                          }}
                        >
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(permission)}>{t("common.delete")}</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setSaveAttempted(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? t("common.edit") : t("common.create")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{t("perms.col.perm")}</Label>
              <Input
                value={editing?.name ?? ""}
                placeholder={t("perms.namePlaceholder")}
                onChange={(event) =>
                  setEditing((current) =>
                    current ? { ...current, name: event.target.value } : current,
                  )
                }
              />
              <div className="text-xs text-muted-foreground">
                {t("perms.nameHint")}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("perms.categoryLabel")}</Label>
              <Input
                value={editing?.category ?? ""}
                placeholder={t("perms.categoryPlaceholder")}
                onChange={(event) =>
                  setEditing((current) =>
                    current ? { ...current, category: event.target.value } : current,
                  )
                }
              />
              <div className="text-xs text-muted-foreground">
                {t("perms.categoryHint")}
              </div>
              {normalizedEditor ? (
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  {t("perms.normalizedPreview")}{" "}
                  <code className="text-foreground">
                    {normalizedEditor.category || "access.users"}
                  </code>
                </div>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>{t("roles.description")}</Label>
              <Input
                value={editing?.description ?? ""}
                placeholder={t("perms.descriptionPlaceholder")}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? { ...current, description: event.target.value }
                      : current,
                  )
                }
              />
            </div>
            {saveAttempted && editorErrors.length > 0 ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {editorErrors[0]}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setSaveAttempted(false);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-gradient-brand text-primary-foreground"
              disabled={!canSave}
              onClick={async () => {
                if (!editing) return;
                setSaveAttempted(true);
                if (!canSave || !normalizedEditor) {
                  return;
                }

                try {
                  if (editing.id) {
                    await identityFetch<CommandResult>(session, `/api/admin/tenant/permissions/${editing.id}/edit`, {
                      method: "POST",
                      body: JSON.stringify({
                        name: normalizedEditor.name,
                        category: normalizedEditor.category,
                        description: editing.description,
                      }),
                    });
                  } else {
                    await identityFetch<CommandResult>(session, "/api/admin/tenant/permissions", {
                      method: "POST",
                      body: JSON.stringify({
                        name: normalizedEditor.name,
                        category: normalizedEditor.category,
                        description: editing.description,
                      }),
                    });
                  }

                  toast.success(
                    editing.id ? t("perms.permUpdated") : t("perms.permCreated"),
                  );
                  setEditing(null);
                  setSaveAttempted(false);
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
                  toast.success(t("perms.permDeleted"));
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
    const firstCategory = permissionsResult[0].category;
    setActiveModule((current) => current || firstCategory);
  }
}

function PermissionModuleBranch({
  node,
  activeModuleId,
  openModules,
  setOpenModules,
  onSelect,
  depth = 0,
}: {
  node: PermissionTreeNode;
  activeModuleId: string;
  openModules: Record<string, boolean>;
  setOpenModules: Dispatch<SetStateAction<Record<string, boolean>>>;
  onSelect: (moduleId: string) => void;
  depth?: number;
}) {
  const hasChildren = node.children.length > 0;
  const isOpen = openModules[node.id] ?? true;
  const isActive = activeModuleId === node.id;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg",
          isActive && "bg-gradient-brand-soft",
        )}
      >
        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-accent disabled:opacity-0"
          onClick={() =>
            setOpenModules((current) => ({ ...current, [node.id]: !isOpen }))
          }
          disabled={!hasChildren}
          aria-label={`Toggle ${node.label}`}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent",
            isActive && "font-semibold text-foreground",
          )}
          style={{ paddingLeft: `${12 + depth * 14}px` }}
        >
          <span className="truncate">{node.label}</span>
          <Badge variant="outline" className="ml-2 font-normal">
            {node.permissionIds.length}
          </Badge>
        </button>
      </div>

      {hasChildren && isOpen ? (
        <div className="space-y-1 border-l border-border/70 pl-2">
          {node.children.map((child) => (
            <PermissionModuleBranch
              key={child.id}
              node={child}
              activeModuleId={activeModuleId}
              openModules={openModules}
              setOpenModules={setOpenModules}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function flattenNodeIds(nodes: PermissionTreeNode[]): string[] {
  return nodes.flatMap((node) => [node.id, ...flattenNodeIds(node.children)]);
}

function findTreeNode(
  nodes: PermissionTreeNode[],
  nodeId: string,
): PermissionTreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    const nested = findTreeNode(node.children, nodeId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function normalizePermissionPath(value: string) {
  return value
    .split(/[./\\:>|]/)
    .map((segment) => segment.trim().toLowerCase())
    .filter(Boolean)
    .join(".");
}

function validatePermissionEditor(
  editor: PermissionEditor | null,
  t: (key: string) => string,
) {
  if (!editor) {
    return [];
  }

  const errors: string[] = [];
  const normalizedName = normalizePermissionPath(editor.name);
  const normalizedCategory = normalizePermissionPath(editor.category);

  if (!normalizedName) {
    errors.push(t("perms.errNameRequired"));
  }

  if (!normalizedCategory) {
    errors.push(t("perms.errCategoryRequired"));
  }

  if (normalizedName && !isValidPermissionPath(normalizedName)) {
    errors.push(t("perms.errNameFormat"));
  }

  if (normalizedCategory && !isValidPermissionPath(normalizedCategory)) {
    errors.push(t("perms.errCategoryFormat"));
  }

  return errors;
}

function isValidPermissionPath(value: string) {
  return value
    .split(".")
    .every((segment) => /^[a-z0-9_-]+$/.test(segment));
}
