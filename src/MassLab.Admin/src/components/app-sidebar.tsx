import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  KeyRound,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useI18n();
  const { user } = useAuth();
  const path = useRouterState({ select: (r) => r.location.pathname });

  const account = [
    { title: t("nav.dashboard"), url: "/admin/dashboard", icon: LayoutDashboard },
    { title: t("nav.profile"), url: "/admin/profile", icon: UserRound },
  ];
  const tenant = [
    { title: t("nav.orgs"), url: "/admin/tenant/organizations", icon: Building2 },
  ];
  const catalog = [
    { title: t("nav.orders"), url: "/admin/orders", icon: ShoppingCart },
    { title: t("nav.products"), url: "/admin/products", icon: Package },
  ];
  const access = [
    { title: t("nav.users"), url: "/admin/access-control/users", icon: Users },
    { title: t("nav.roles"), url: "/admin/access-control/roles", icon: ShieldCheck },
    { title: t("nav.perms"), url: "/admin/access-control/permissions", icon: KeyRound },
  ];

  const isActive = (url: string) => path === url || path.startsWith(url + "/");

  const Section = ({ label, items }: { label: string; items: typeof account }) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((it) => (
            <SidebarMenuItem key={it.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive(it.url)}
                className="data-[active=true]:bg-gradient-brand-soft data-[active=true]:text-foreground data-[active=true]:font-semibold"
              >
                <Link to={it.url} className="flex items-center gap-2.5">
                  <it.icon className="h-4 w-4" />
                  {!collapsed && <span>{it.title}</span>}
                  {!collapsed && isActive(it.url) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 shrink-0 border-b border-sidebar-border px-3 !flex !flex-row items-center">
        {collapsed ? <Logo size={28} showWord={false} /> : <Logo size={32} />}
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        <Section label={t("nav.account")} items={account} />
        <Section label={t("nav.tenant")} items={tenant} />
        <Section label={t("nav.catalog")} items={catalog} />
        <Section label={t("nav.access")} items={access} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/60 p-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.organization}</div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export function initials(name: string) {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}
