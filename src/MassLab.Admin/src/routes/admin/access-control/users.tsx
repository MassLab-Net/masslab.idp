import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, MoreHorizontal, Plus, Search, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { ROLES, USERS, ORGANIZATIONS, type User } from "@/lib/mock-data";
import { initials } from "@/components/app-sidebar";
import { StatusPill, statusVariant } from "@/components/status-pill";
import { PageHeader } from "../tenant/organizations";
import { PermissionTree } from "@/components/permission-tree";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/access-control/users")({
  head: () => ({ meta: [{ title: "Users — MassLab IAM" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>(USERS);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [directFilter, setDirectFilter] = useState<"all" | "any" | "none">("all");
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [resetTarget, setResetTarget] = useState<User | null>(null);

  const activeAdvanced =
    (roleFilter !== "all" ? 1 : 0) + (orgFilter !== "all" ? 1 : 0) + (directFilter !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQ = !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
      const matchesS = statusFilter === "all" || u.status.toLowerCase() === statusFilter;
      const matchesR = roleFilter === "all" || u.roles.includes(roleFilter);
      const matchesO = orgFilter === "all" || u.organization === orgFilter;
      const matchesD =
        directFilter === "all" ||
        (directFilter === "any" ? u.directPermissions.length > 0 : u.directPermissions.length === 0);
      return matchesQ && matchesS && matchesR && matchesO && matchesD;
    });
  }, [users, q, statusFilter, roleFilter, orgFilter, directFilter]);

  const resetAdvanced = () => { setRoleFilter("all"); setOrgFilter("all"); setDirectFilter("all"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        action={
          <Button onClick={() => setCreating(true)} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
            <Plus className="mr-1.5 h-4 w-4" /> {t("users.invite")}
          </Button>
        }
      />

      <Card className="border-border shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("users.search")} className="h-9 pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("users.status.all")}</SelectItem>
              <SelectItem value="active">{t("users.status.active")}</SelectItem>
              <SelectItem value="invited">{t("users.status.invited")}</SelectItem>
              <SelectItem value="disabled">{t("users.status.disabled")}</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-1.5 h-4 w-4" /> {t("users.more")}
                {activeAdvanced > 0 && <Badge className="ml-2 h-5 bg-gradient-brand px-1.5 text-[10px] text-primary-foreground">{activeAdvanced}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[320px] p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-semibold">{t("users.filters")}</div>
                <button className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50" onClick={resetAdvanced} disabled={activeAdvanced === 0}>{t("common.reset")}</button>
              </div>
              <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("users.filter.role")}</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("common.all")}</SelectItem>
                      {ROLES.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("users.filter.org")}</Label>
                  <Select value={orgFilter} onValueChange={setOrgFilter}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("common.all")}</SelectItem>
                      {ORGANIZATIONS.map((o) => <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("users.filter.direct")}</Label>
                  <Select value={directFilter} onValueChange={(v) => setDirectFilter(v as "all" | "any" | "none")}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("common.all")}</SelectItem>
                      <SelectItem value="any">{t("users.filter.directAny")}</SelectItem>
                      <SelectItem value="none">{t("users.filter.directNone")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {activeAdvanced > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={resetAdvanced}>
              <X className="mr-1 h-3.5 w-3.5" /> {t("common.reset")}
            </Button>
          )}
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} {t("common.of")} {users.length}</div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"><Checkbox /></TableHead>
              <TableHead>{t("users.col.user")}</TableHead>
              <TableHead>{t("users.col.roles")}</TableHead>
              <TableHead>{t("users.col.direct")}</TableHead>
              <TableHead>{t("users.col.status")}</TableHead>
              <TableHead>{t("users.col.org")}</TableHead>
              <TableHead>{t("users.col.last")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id} className="cursor-pointer" onClick={() => setEditing(u)}>
                <TableCell onClick={(e) => e.stopPropagation()}><Checkbox /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">{initials(u.name)}</div>
                    <div><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((rid) => { const r = ROLES.find((x) => x.id === rid); return <Badge key={rid} variant="secondary" className="font-normal">{r?.name}</Badge>; })}
                  </div>
                </TableCell>
                <TableCell>
                  {u.directPermissions.length > 0
                    ? <Badge variant="outline" className="border-primary/40 text-primary">+{u.directPermissions.length}</Badge>
                    : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
                <TableCell><StatusPill variant={statusVariant(u.status)}>{u.status}</StatusPill></TableCell>
                <TableCell className="text-sm">{u.organization}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.lastActive}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(u)}>{t("common.edit")}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setResetTarget(u)}>{t("users.resetPw")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(u)}>{t("common.delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <UserSheet open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }} user={editing} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.deleteDesc")}{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) return;
                setUsers((s) => s.filter((x) => x.id !== deleteTarget.id));
                toast.success(t("users.deleted"));
                setDeleteTarget(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.resetTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.resetDesc")}{" "}
              <span className="font-medium text-foreground">{resetTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!resetTarget) return;
                toast.info(t("users.resetSent"));
                setResetTarget(null);
              }}
            >
              {t("users.resetPw")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserSheet({ open, onClose, user }: { open: boolean; onClose: () => void; user: User | null }) {
  const { t } = useI18n();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [roles, setRoles] = useState<string[]>(user?.roles ?? []);
  const [direct, setDirect] = useState<string[]>(user?.directPermissions ?? []);

  useMemo(() => { setName(user?.name ?? ""); setEmail(user?.email ?? ""); setRoles(user?.roles ?? []); setDirect(user?.directPermissions ?? []); }, [user]);

  const effective = useMemo(() => {
    const s = new Set<string>();
    roles.forEach((rid) => ROLES.find((r) => r.id === rid)?.permissions.forEach((p) => s.add(p)));
    direct.forEach((p) => s.add(p));
    return Array.from(s);
  }, [roles, direct]);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">{user ? t("users.editTitle") : t("users.inviteTitle")}</SheetTitle>
          <SheetDescription>{t("users.editDesc")}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="details" className="mt-5">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t("users.tab.details")}</TabsTrigger>
            <TabsTrigger value="roles">{t("users.tab.roles")} ({roles.length})</TabsTrigger>
            <TabsTrigger value="perms">{t("users.tab.perms")} ({effective.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2"><Label>{t("users.fullName")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{t("users.email")}</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{t("users.organization")}</Label>
              <Select defaultValue={ORGANIZATIONS[0].id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ORGANIZATIONS.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="roles" className="mt-4 space-y-2">
            {ROLES.map((r) => {
              const checked = roles.includes(r.id);
              return (
                <label key={r.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3 transition hover:bg-accent/50 has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-brand-soft">
                  <Checkbox checked={checked} onCheckedChange={(v) => setRoles((s) => v ? [...s, r.id] : s.filter((x) => x !== r.id))} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><div className="font-semibold">{r.name}</div>{r.system && <Badge variant="outline" className="font-normal">{t("users.system")}</Badge>}</div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.permissions.length} {t("users.permissions")}</div>
                  </div>
                </label>
              );
            })}
          </TabsContent>
          <TabsContent value="perms" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">{t("users.permsInherit")}</p>
            <PermissionTree selected={effective} highlightDirect={direct}
              onChange={(next) => {
                const fromRoles = new Set<string>();
                roles.forEach((rid) => ROLES.find((r) => r.id === rid)?.permissions.forEach((p) => fromRoles.add(p)));
                setDirect(next.filter((p) => !fromRoles.has(p)));
              }}
            />
          </TabsContent>
        </Tabs>
        <SheetFooter className="mt-6 flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button className="bg-gradient-brand text-primary-foreground" onClick={() => { toast.success(user ? t("users.updated") : t("users.invited")); onClose(); }}>
            {user ? t("common.save") : t("users.invite")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
