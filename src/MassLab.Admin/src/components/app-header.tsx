import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, LogOut, Search, Settings, ShieldCheck, UserPlus, KeyRound, Building2 } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { buildLogoutUrl } from "@/lib/oidc";
import { initials } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/components/flag";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  icon: React.ElementType;
  titleEn: string;
  titleVi: string;
  subEn: string;
  subVi: string;
  time: string;
  unread: boolean;
};

const INITIAL_NOTIFS: Notif[] = [
  {
    id: "n1",
    icon: UserPlus,
    titleEn: "New user invited",
    titleVi: "Đã mời người dùng mới",
    subEn: "priya.singh@masslab.io joined Acme Corp",
    subVi: "priya.singh@masslab.io đã tham gia Acme Corp",
    time: "2m",
    unread: true,
  },
  {
    id: "n2",
    icon: ShieldCheck,
    titleEn: "Role updated",
    titleVi: "Vai trò đã cập nhật",
    subEn: "Security Engineer · +3 permissions",
    subVi: "Security Engineer · +3 quyền",
    time: "1h",
    unread: true,
  },
  {
    id: "n3",
    icon: KeyRound,
    titleEn: "Direct permission granted",
    titleVi: "Đã cấp quyền trực tiếp",
    subEn: "org.audit.read → linh.nguyen",
    subVi: "org.audit.read → linh.nguyen",
    time: "3h",
    unread: true,
  },
  {
    id: "n4",
    icon: Building2,
    titleEn: "Organization suspended",
    titleVi: "Tổ chức đã tạm ngưng",
    subEn: "Globex Health · billing past due",
    subVi: "Globex Health · quá hạn thanh toán",
    time: "Yesterday",
    unread: false,
  },
];

export function AppHeader() {
  const { session, user, signOut } = useAuth();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-3 backdrop-blur md:px-5">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="relative hidden md:block md:w-[360px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("header.search")} className="h-9 pl-9" />
        <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden gap-1.5 border-border font-normal md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {user?.organization}
        </Badge>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground" aria-label={t("header.notifications")}>
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-brand px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[360px] p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="text-sm font-semibold">{t("header.notifications")}</div>
              <button
                className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                disabled={unread === 0}
                onClick={() => setNotifs((s) => s.map((n) => ({ ...n, unread: false })))}
              >
                {t("header.markAll")}
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">{t("header.empty")}</div>
              ) : (
                notifs.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNotifs((s) => s.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-accent",
                      n.unread && "bg-gradient-brand-soft/40",
                    )}
                  >
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand-soft text-primary">
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-medium">{lang === "vi" ? n.titleVi : n.titleEn}</div>
                        {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{lang === "vi" ? n.subVi : n.subEn}</div>
                    </div>
                    <div className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</div>
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-border px-4 py-2 text-center">
              <button className="text-xs font-medium text-primary hover:underline">{t("header.viewAll")}</button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2 text-muted-foreground hover:text-foreground" aria-label={t("login.lang")}>
              <Flag lang={lang} className="h-3.5 w-5 rounded-sm shadow-sm" />
              <span className="text-xs font-semibold uppercase">{lang}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>{t("login.lang")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLang("en")} className="gap-2">
              <Flag lang="en" className="h-3.5 w-5 rounded-sm" /> English {lang === "en" && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("vi")} className="gap-2">
              <Flag lang="vi" className="h-3.5 w-5 rounded-sm" /> Tiếng Việt {lang === "vi" && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition hover:bg-accent">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-[11px] font-semibold text-primary-foreground">
                {user ? initials(user.name) : "?"}
              </div>
              <span className="hidden text-sm font-medium md:inline">{user?.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/admin/profile" })}>
              <Settings className="mr-2 h-4 w-4" /> {t("nav.profile")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                const logoutUrl = session ? buildLogoutUrl(session) : null;
                signOut();
                if (logoutUrl) {
                  window.location.assign(logoutUrl);
                  return;
                }

                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> {t("nav.signout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
