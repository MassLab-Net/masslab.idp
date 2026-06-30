import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Building2,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { USERS, ROLES, ORGANIZATIONS, PERMISSION_MODULES } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { initials } from "@/components/app-sidebar";
import { statusVariant, StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MassLab IAM" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const totalPerms = PERMISSION_MODULES.reduce((n, m) => n + m.permissions.length, 0);

  const stats = [
    { label: t("dash.users"), value: USERS.length, change: t("dash.usersChange"), icon: Users, to: "/admin/access-control/users" },
    { label: t("dash.roles"), value: ROLES.length, change: t("dash.rolesChange"), icon: ShieldCheck, to: "/admin/access-control/roles" },
    { label: t("dash.perms"), value: totalPerms, change: `${PERMISSION_MODULES.length} ${t("dash.modules")}`, icon: KeyRound, to: "/admin/access-control/permissions" },
    { label: t("dash.orgs"), value: ORGANIZATIONS.length, change: t("dash.orgsChange"), icon: Building2, to: "/admin/tenant/organizations" },
  ];

  const recent = USERS.slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("dash.overview")}
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 border-success/40 text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {t("dash.ok")}
        </Badge>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="group relative overflow-hidden border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-brand opacity-0 transition group-hover:opacity-100" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-3xl font-bold tracking-tight">{s.value}</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.change}</span>
                  <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                    {t("dash.viewAll")} <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">{t("dash.recentUsers")}</CardTitle>
            <Link to="/admin/access-control/users" className="text-sm font-medium text-primary hover:underline">
              {t("dash.viewAll")}
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dash.col.user")}</TableHead>
                  <TableHead>{t("dash.col.roles")}</TableHead>
                  <TableHead>{t("dash.col.status")}</TableHead>
                  <TableHead className="text-right">{t("dash.col.last")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                          {initials(u.name)}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.slice(0, 2).map((rid) => {
                          const r = ROLES.find((x) => x.id === rid);
                          return (
                            <Badge key={rid} variant="secondary" className="font-normal">
                              {r?.name}
                            </Badge>
                          );
                        })}
                        {u.roles.length > 2 && (
                          <Badge variant="outline" className="font-normal">+{u.roles.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill variant={statusVariant(u.status)}>{u.status}</StatusPill>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{u.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-primary" /> {t("dash.recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { who: "Linh Nguyen", what: "assigned role Security Engineer to 3 users", when: "2m ago" },
              { who: "Aiden Smith", what: "created role Billing Manager", when: "1h ago" },
              { who: "System", what: "Microsoft Entra ID sync completed (248 users)", when: "3h ago" },
              { who: "Sofia Garcia", what: "granted direct permission org.audit.read", when: "Yesterday" },
              { who: "Hai Le", what: "suspended organization Globex Health", when: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-brand" />
                <div className="text-sm">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
