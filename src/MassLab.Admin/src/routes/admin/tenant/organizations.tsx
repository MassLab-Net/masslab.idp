import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, MoreHorizontal, Plus, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { ORGANIZATIONS, type Organization } from "@/lib/mock-data";
import { StatusPill, statusVariant } from "@/components/status-pill";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tenant/organizations")({
  head: () => ({ meta: [{ title: "Organizations — MassLab IAM" }] }),
  component: Organizations,
});

function Organizations() {
  const { t } = useI18n();
  const [orgs, setOrgs] = useState<Organization[]>(ORGANIZATIONS);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const filtered = orgs.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("org.title")}
        subtitle={t("org.subtitle")}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
                <Plus className="mr-1.5 h-4 w-4" /> {t("org.new")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("org.create")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>{t("org.name")}</Label><Input placeholder="Acme Corporation" /></div>
                <div className="space-y-1.5"><Label>{t("org.subdomain")}</Label>
                  <div className="flex items-center rounded-md border border-input bg-card overflow-hidden">
                    <Input placeholder="acme" className="border-0 focus-visible:ring-0" />
                    <span className="px-3 text-sm text-muted-foreground border-l border-input">.masslab.io</span>
                  </div>
                </div>
                <div className="space-y-1.5"><Label>{t("org.plan")}</Label>
                  <Select defaultValue="Business">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
                <Button className="bg-gradient-brand text-primary-foreground" onClick={() => { setOpen(false); toast.success(t("org.created")); }}>{t("common.create")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: t("org.stat.total"), v: orgs.length },
          { l: t("org.stat.ent"), v: orgs.filter((o) => o.plan === "Enterprise").length },
          { l: t("org.stat.active"), v: orgs.reduce((n, o) => n + o.members, 0).toLocaleString() },
          { l: t("org.stat.suspended"), v: orgs.filter((o) => o.status === "Suspended").length },
        ].map((s) => (
          <Card key={s.l} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">{s.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-card">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("org.search")} className="h-9 pl-9" />
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
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft text-primary"><Building2 className="h-4 w-4" /></div>
                    <div><div className="font-medium">{o.name}</div><code className="text-xs text-muted-foreground">{o.slug}.masslab.io</code></div>
                  </div>
                </TableCell>
                <TableCell><StatusPill variant={statusVariant(o.plan)}>{o.plan}</StatusPill></TableCell>
                <TableCell className="font-medium">{o.members.toLocaleString()}</TableCell>
                <TableCell><StatusPill variant={statusVariant(o.status)}>{o.status}</StatusPill></TableCell>
                <TableCell className="text-sm text-muted-foreground">{o.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info(t("org.settings"))}>{t("org.settings")}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info(t("org.impersonate"))}>{t("org.impersonate")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(o)}>{t("common.delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("org.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("org.deleteDesc")}{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name ?? ""}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) return;
                setOrgs((s) => s.filter((x) => x.id !== deleteTarget.id));
                toast.success(t("org.deleted"));
                setDeleteTarget(null);
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
