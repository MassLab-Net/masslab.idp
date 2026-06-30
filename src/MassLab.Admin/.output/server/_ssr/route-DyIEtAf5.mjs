import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { P as useNavigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn, t as Button } from "./button-BPK1zgJN.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { K as Bell, T as KeyRound, W as Building2, a as UserPlus, f as ShieldCheck, h as Search, m as Settings, x as LogOut } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { n as buildLogoutUrl } from "./oidc-Drkv9Zoo.mjs";
import { t as Flag } from "./flag-gbFpOcqo.mjs";
import { a as initials, i as SidebarTrigger, n as SidebarInset, r as SidebarProvider, t as AppSidebar } from "./app-sidebar-DWLue5Me.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-CEsLMvuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DyIEtAf5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_NOTIFS = [
	{
		id: "n1",
		icon: UserPlus,
		titleEn: "New user invited",
		titleVi: "Đã mời người dùng mới",
		subEn: "priya.singh@masslab.io joined Acme Corp",
		subVi: "priya.singh@masslab.io đã tham gia Acme Corp",
		time: "2m",
		unread: true
	},
	{
		id: "n2",
		icon: ShieldCheck,
		titleEn: "Role updated",
		titleVi: "Vai trò đã cập nhật",
		subEn: "Security Engineer · +3 permissions",
		subVi: "Security Engineer · +3 quyền",
		time: "1h",
		unread: true
	},
	{
		id: "n3",
		icon: KeyRound,
		titleEn: "Direct permission granted",
		titleVi: "Đã cấp quyền trực tiếp",
		subEn: "org.audit.read → linh.nguyen",
		subVi: "org.audit.read → linh.nguyen",
		time: "3h",
		unread: true
	},
	{
		id: "n4",
		icon: Building2,
		titleEn: "Organization suspended",
		titleVi: "Tổ chức đã tạm ngưng",
		subEn: "Globex Health · billing past due",
		subVi: "Globex Health · quá hạn thanh toán",
		time: "Yesterday",
		unread: false
	}
];
function AppHeader() {
	const { session, user, signOut } = useAuth();
	const { lang, setLang, t } = useI18n();
	const navigate = useNavigate();
	const [notifs, setNotifs] = (0, import_react.useState)(INITIAL_NOTIFS);
	const unread = notifs.filter((n) => n.unread).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-3 backdrop-blur md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, { className: "text-muted-foreground hover:text-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden md:block md:w-[360px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: t("header.search"),
						className: "h-9 pl-9"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline",
						children: "⌘K"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "hidden gap-1.5 border-border font-normal md:inline-flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-success" }), user?.organization]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "icon",
							className: "relative text-muted-foreground",
							"aria-label": t("header.notifications"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-brand px-1 text-[10px] font-semibold text-primary-foreground",
								children: unread
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
						align: "end",
						className: "w-[360px] p-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: t("header.notifications")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-xs font-medium text-primary hover:underline disabled:opacity-50",
									disabled: unread === 0,
									onClick: () => setNotifs((s) => s.map((n) => ({
										...n,
										unread: false
									}))),
									children: t("header.markAll")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-[360px] overflow-y-auto",
								children: notifs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-4 py-10 text-center text-sm text-muted-foreground",
									children: t("header.empty")
								}) : notifs.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setNotifs((s) => s.map((x) => x.id === n.id ? {
										...x,
										unread: false
									} : x)),
									className: cn("flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-accent", n.unread && "bg-gradient-brand-soft/40"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "truncate text-sm font-medium",
													children: lang === "vi" ? n.titleVi : n.titleEn
												}), n.unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: lang === "vi" ? n.subVi : n.subEn
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground",
											children: n.time
										})
									]
								}, n.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border px-4 py-2 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-xs font-medium text-primary hover:underline",
									children: t("header.viewAll")
								})
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "gap-2 px-2 text-muted-foreground hover:text-foreground",
							"aria-label": t("login.lang"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								lang,
								className: "h-3.5 w-5 rounded-sm shadow-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase",
								children: lang
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-44",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t("login.lang") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setLang("en"),
								className: "gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
										lang: "en",
										className: "h-3.5 w-5 rounded-sm"
									}),
									" English ",
									lang === "en" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-primary",
										children: "✓"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setLang("vi"),
								className: "gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
										lang: "vi",
										className: "h-3.5 w-5 rounded-sm"
									}),
									" Tiếng Việt ",
									lang === "vi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-primary",
										children: "✓"
									})
								]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "ml-1 flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-[11px] font-semibold text-primary-foreground",
								children: user ? initials(user.name) : "?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-sm font-medium md:inline",
								children: user?.name
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: user?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-normal text-muted-foreground",
								children: user?.email
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => navigate({ to: "/admin/profile" }),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }),
									" ",
									t("nav.profile")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								className: "text-destructive focus:text-destructive",
								onClick: () => {
									const logoutUrl = session ? buildLogoutUrl(session) : null;
									signOut();
									if (logoutUrl) {
										window.location.assign(logoutUrl);
										return;
									}
									navigate({ to: "/auth" });
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }),
									" ",
									t("nav.signout")
								]
							})
						]
					})] })
				]
			})
		]
	});
}
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider, {
		style: {
			"--sidebar-width": "16rem",
			"--sidebar-width-icon": "3.25rem"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen w-full bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarInset, {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 md:px-8 md:py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})]
		})
	});
}
//#endregion
export { AdminLayout as component };
