import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as PageHeader } from "./organizations-DNmoE0r-.mjs";
import { r as cn, t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { T as KeyRound, h as Search, nt as Layers, rt as Ellipsis, v as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { t as identityFetch } from "./identity-api-DHRTF7en.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-cKdyAgSG.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Cot7DC_T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-DGpA-URk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PermissionsPage() {
	const { t } = useI18n();
	const { session } = useAuth();
	const [permissions, setPermissions] = (0, import_react.useState)([]);
	const [roleMappings, setRoleMappings] = (0, import_react.useState)({});
	const [activeModule, setActiveModule] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
	}, [session]);
	const modules = (0, import_react.useMemo)(() => {
		const grouped = permissions.reduce((accumulator, permission) => {
			const key = permission.category || "ungrouped";
			accumulator[key] = [...accumulator[key] ?? [], permission];
			return accumulator;
		}, {});
		return Object.entries(grouped).map(([id, items]) => ({
			id,
			name: id,
			permissions: items
		}));
	}, [permissions]);
	const current = modules.find((module) => module.id === activeModule) ?? modules[0] ?? {
		id: "",
		name: "",
		permissions: []
	};
	const filteredPermissions = current.permissions.filter((permission) => !q || permission.name.toLowerCase().includes(q.toLowerCase()) || permission.description?.toLowerCase().includes(q.toLowerCase()));
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("perms.title"),
				subtitle: t("perms.subtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing({
						name: "",
						category: activeModule || modules[0]?.id || "",
						description: ""
					}),
					className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
						" ",
						t("perms.addPerm")
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						l: t("perms.stat.total"),
						v: permissions.length
					},
					{
						l: t("perms.stat.modules"),
						v: modules.length
					},
					{
						l: t("perms.stat.used"),
						v: Object.values(roleMappings).reduce((sum, names) => sum + names.length, 0)
					},
					{
						l: t("perms.stat.coverage"),
						v: "100%"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: item.l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-2xl font-bold tracking-tight",
							children: item.v
						})]
					})
				}, item.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[260px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-card lg:sticky lg:top-20 lg:self-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between border-b border-border p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }),
								" ",
								t("perms.modules")
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2",
						children: modules.map((module) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveModule(module.id),
							className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition", module.id === current.id ? "bg-gradient-brand-soft font-semibold text-foreground" : "hover:bg-accent"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: module.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "font-normal",
								children: module.permissions.length
							})]
						}, module.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: current.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									current.permissions.length,
									" ",
									t("perms.inModule")
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-64 max-w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (event) => setQ(event.target.value),
								placeholder: t("common.search"),
								className: "h-9 pl-9"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("perms.col.perm") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("perms.col.id") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("perms.col.usedBy") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredPermissions.map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: permission.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs text-muted-foreground",
							children: permission.name
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1",
							children: [(roleMappings[permission.id] ?? []).map((roleName) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "font-normal",
								children: roleName
							}, roleName)), (roleMappings[permission.id] ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: t("perms.unassigned")
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => setEditing({
										id: permission.id,
										name: permission.name,
										category: permission.category,
										description: permission.description ?? ""
									}),
									children: t("common.edit")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: () => setDeleteTarget(permission),
									children: t("common.delete")
								})]
							})] })
						})
					] }, permission.id)) })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? t("common.edit") : t("common.create") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("perms.col.perm") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing?.name ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										name: event.target.value
									} : current)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing?.category ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										category: event.target.value
									} : current)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("roles.description") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing?.description ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										description: event.target.value
									} : current)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEditing(null),
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-primary-foreground",
						onClick: async () => {
							if (!editing) return;
							try {
								if (editing.id) await identityFetch(session, `/api/admin/tenant/permissions/${editing.id}/edit`, {
									method: "POST",
									body: JSON.stringify({
										name: editing.name,
										category: editing.category,
										description: editing.description
									})
								});
								else await identityFetch(session, "/api/admin/tenant/permissions", {
									method: "POST",
									body: JSON.stringify({
										name: editing.name,
										category: editing.category,
										description: editing.description
									})
								});
								toast.success(editing.id ? "Permission updated." : "Permission created.");
								setEditing(null);
								await loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
							} catch (reason) {
								toast.error(reason instanceof Error ? reason.message : "Unable to save the permission.");
							}
						},
						children: t("common.save")
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteTarget,
				onOpenChange: (open) => !open && setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: t("common.delete") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Remove permission ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: deleteTarget?.name ?? ""
					}),
					"?"
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: t("common.cancel") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					onClick: async () => {
						if (!deleteTarget) return;
						try {
							await identityFetch(session, `/api/admin/tenant/permissions/${deleteTarget.id}/delete`, { method: "POST" });
							toast.success("Permission deleted.");
							setDeleteTarget(null);
							await loadPermissions(session, setPermissions, setRoleMappings, setActiveModule);
						} catch (reason) {
							toast.error(reason instanceof Error ? reason.message : "Unable to delete the permission.");
						}
					},
					children: t("common.delete")
				})] })] })
			})
		]
	});
}
async function loadPermissions(session, setPermissions, setRoleMappings, setActiveModule) {
	const [permissionsResult, rolesResult] = await Promise.all([identityFetch(session, "/api/admin/tenant/permissions?q=&sort=category&dir=asc"), identityFetch(session, "/api/admin/tenant/roles?q=&sort=name&dir=asc")]);
	const roleNameMap = Object.fromEntries(rolesResult.roles.map((role) => [role.id, role.name]));
	const mappings = {};
	for (const permission of permissionsResult) mappings[permission.id] = [];
	for (const [roleId, permissionIds] of Object.entries(rolesResult.assignedPermissionIds)) for (const permissionId of permissionIds) mappings[permissionId] = [...mappings[permissionId] ?? [], roleNameMap[roleId] ?? roleId];
	setPermissions(permissionsResult);
	setRoleMappings(mappings);
	if (permissionsResult.length > 0) setActiveModule((current) => current || permissionsResult[0].category);
}
//#endregion
export { PermissionsPage as component };
