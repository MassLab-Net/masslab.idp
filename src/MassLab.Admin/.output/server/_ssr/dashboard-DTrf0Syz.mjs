import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-C886EF0p.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { n as statusVariant, t as StatusPill } from "./status-pill-BlcI5odm.mjs";
import { T as KeyRound, W as Building2, Z as Activity, f as ShieldCheck, q as ArrowUpRight, r as Users } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { t as identityFetch } from "./identity-api-DHRTF7en.mjs";
import { a as initials } from "./app-sidebar-DWLue5Me.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DTrf0Syz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user, session, signOut } = useAuth();
	const { t } = useI18n();
	const [dashboard, setDashboard] = (0, import_react.useState)(null);
	const [recentUsers, setRecentUsers] = (0, import_react.useState)([]);
	const [organizationCount, setOrganizationCount] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancelled = false;
		(async () => {
			try {
				const [dashboardData, usersData] = await Promise.all([identityFetch(session, "/api/admin/tenant/dashboard"), identityFetch(session, "/api/admin/tenant/users?q=&sort=email&dir=asc")]);
				let organizations = [];
				try {
					organizations = await identityFetch(session, "/api/admin/system/tenants");
				} catch {
					organizations = [];
				}
				if (cancelled) return;
				setDashboard(dashboardData);
				setRecentUsers(usersData.users.slice(0, 6));
				setOrganizationCount(organizations.length);
			} catch (reason) {
				if (cancelled) return;
				setError(reason instanceof Error ? reason.message : "Unable to load the admin dashboard.");
				signOut();
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [session, signOut]);
	const stats = [
		{
			label: t("dash.users"),
			value: dashboard?.users ?? 0,
			change: recentUsers.length ? `${recentUsers.length} ${t("dash.viewAll")}` : "-",
			icon: Users,
			to: "/admin/access-control/users"
		},
		{
			label: t("dash.roles"),
			value: dashboard?.roles ?? 0,
			change: dashboard ? `${dashboard.permissions} ${t("dash.perms")}` : "-",
			icon: ShieldCheck,
			to: "/admin/access-control/roles"
		},
		{
			label: t("dash.perms"),
			value: dashboard?.permissions ?? 0,
			change: dashboard ? `${dashboard.providers} providers` : "-",
			icon: KeyRound,
			to: "/admin/access-control/permissions"
		},
		{
			label: t("dash.orgs"),
			value: organizationCount,
			change: dashboard ? `${dashboard.clients} apps` : "-",
			icon: Building2,
			to: "/admin/tenant/organizations"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: t("dash.overview")
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "gap-1.5 border-success/40 text-success",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-success" }), user?.organization]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-destructive/20 bg-destructive/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-4 text-sm text-destructive",
					children: error
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: s.to,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "group relative overflow-hidden border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 -top-px h-px bg-gradient-brand opacity-0 transition group-hover:opacity-100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-3xl font-bold tracking-tight",
									children: s.value
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: s.change
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100",
									children: [
										t("dash.viewAll"),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })
									]
								})]
							})]
						})]
					})
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 border-border shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-semibold",
							children: t("dash.recentUsers")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/access-control/users",
							className: "text-sm font-medium text-primary hover:underline",
							children: t("dash.viewAll")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("dash.col.user") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("dash.col.roles") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("dash.col.status") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: t("dash.col.last")
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: recentUsers.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground",
									children: initials(account.displayName)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: account.displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: account.email
								})] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "font-normal",
								children: account.isSystemAdmin ? "System Admin" : account.isTenantAdmin ? "Tenant Admin" : "User"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: statusVariant(account.isEnabled ? "Active" : "Disabled"),
								children: account.isEnabled ? "Active" : "Disabled"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right text-sm text-muted-foreground",
								children: account.isEnabled ? "Current" : "Disabled"
							})
						] }, account.id)) })] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-primary" }),
							" ",
							t("dash.recentActivity")
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: (dashboard?.recentAuditLogs ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: item.eventType
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											item.targetType,
											" ",
											item.targetId
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: new Date(item.createdAt).toLocaleString()
									})
								]
							})]
						}, item.id))
					})]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
