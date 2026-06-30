import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as PageHeader } from "./organizations-DNmoE0r-.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { t as Textarea } from "./textarea-CxCjlOsm.mjs";
import { f as ShieldCheck, r as Users, rt as Ellipsis, v as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { t as Checkbox } from "./checkbox-S7S1jDr4.mjs";
import { t as identityFetch } from "./identity-api-DHRTF7en.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-cKdyAgSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roles-Bui5E7GB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RolesPage() {
	const { t } = useI18n();
	const { session } = useAuth();
	const [q, setQ] = (0, import_react.useState)("");
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [permissions, setPermissions] = (0, import_react.useState)([]);
	const [assignedPermissionIds, setAssignedPermissionIds] = (0, import_react.useState)({});
	const [userCounts, setUserCounts] = (0, import_react.useState)({});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [assigningRoleId, setAssigningRoleId] = (0, import_react.useState)(null);
	const [selectedPermissionIds, setSelectedPermissionIds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
	}, [session]);
	const filtered = (0, import_react.useMemo)(() => roles.filter((role) => !q || role.name.toLowerCase().includes(q.toLowerCase()) || role.description.toLowerCase().includes(q.toLowerCase())), [roles, q]);
	const permissionGroups = (0, import_react.useMemo)(() => {
		return permissions.reduce((groups, permission) => {
			const key = permission.category || "Ungrouped";
			groups[key] = [...groups[key] ?? [], permission];
			return groups;
		}, {});
	}, [permissions]);
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("roles.title"),
				subtitle: t("roles.subtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing({
						name: "",
						description: ""
					}),
					className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
						" ",
						t("roles.new")
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "Search roles..."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: filtered.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "group relative overflow-hidden border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: role.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: role.description
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onClick: () => setEditing({
												id: role.id,
												name: role.name,
												description: role.description
											}),
											children: t("common.edit")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onClick: () => {
												setAssigningRoleId(role.id);
												setSelectedPermissionIds(assignedPermissionIds[role.id] ?? []);
											},
											children: t("roles.permissions")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											className: "text-destructive",
											onClick: async () => {
												try {
													await identityFetch(session, `/api/admin/tenant/roles/${role.id}/delete`, { method: "POST" });
													toast.success(t("roles.deleted"));
													await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
												} catch (reason) {
													toast.error(reason instanceof Error ? reason.message : "Unable to delete the role.");
												}
											},
											children: t("common.delete")
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: t("roles.permissions")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: (assignedPermissionIds[role.id] ?? []).length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), t("roles.users")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: userCounts[role.id] ?? 0
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-1",
								children: (assignedPermissionIds[role.id] ?? []).slice(0, 4).map((permissionId) => {
									const permission = permissions.find((item) => item.id === permissionId);
									return permission ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "font-normal",
										children: permission.category
									}, permissionId) : null;
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "mt-5 w-full",
								onClick: () => {
									setAssigningRoleId(role.id);
									setSelectedPermissionIds(assignedPermissionIds[role.id] ?? []);
								},
								children: t("roles.manage")
							})
						]
					})
				}, role.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? t("roles.edit") : t("roles.create") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("roles.name") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editing?.name ?? "",
								onChange: (event) => setEditing((current) => current ? {
									...current,
									name: event.target.value
								} : current)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("roles.description") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: editing?.description ?? "",
								onChange: (event) => setEditing((current) => current ? {
									...current,
									description: event.target.value
								} : current)
							})]
						})]
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
								if (editing.id) await identityFetch(session, `/api/admin/tenant/roles/${editing.id}/edit`, {
									method: "POST",
									body: JSON.stringify({
										name: editing.name,
										description: editing.description
									})
								});
								else await identityFetch(session, "/api/admin/tenant/roles", {
									method: "POST",
									body: JSON.stringify({
										name: editing.name,
										description: editing.description
									})
								});
								toast.success(editing.id ? t("roles.updated") : t("roles.created"));
								setEditing(null);
								await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
							} catch (reason) {
								toast.error(reason instanceof Error ? reason.message : "Unable to save the role.");
							}
						},
						children: t("roles.saveBtn")
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!assigningRoleId,
				onOpenChange: (open) => !open && setAssigningRoleId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("roles.permissions") }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[60vh] space-y-4 overflow-y-auto py-2",
							children: Object.entries(permissionGroups).map(([group, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: group
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2 md:grid-cols-2",
									children: items.map((permission) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-start gap-3 rounded-lg border border-border p-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: selectedPermissionIds.includes(permission.id),
												onCheckedChange: (value) => {
													setSelectedPermissionIds((current) => value === true ? [...current, permission.id] : current.filter((item) => item !== permission.id));
												}
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: permission.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: permission.description || permission.category
											})] })]
										}, permission.id);
									})
								})]
							}, group))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setAssigningRoleId(null),
							children: t("common.cancel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-gradient-brand text-primary-foreground",
							onClick: async () => {
								if (!assigningRoleId) return;
								try {
									await identityFetch(session, `/api/admin/tenant/roles/${assigningRoleId}/permissions`, {
										method: "POST",
										body: JSON.stringify({ permissionIds: selectedPermissionIds })
									});
									toast.success("Role permissions updated.");
									setAssigningRoleId(null);
									await loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts);
								} catch (reason) {
									toast.error(reason instanceof Error ? reason.message : "Unable to update role permissions.");
								}
							},
							children: t("common.save")
						})] })
					]
				})
			})
		]
	});
}
async function loadRoles(session, setRoles, setPermissions, setAssignedPermissionIds, setUserCounts) {
	const [rolesResult, usersResult] = await Promise.all([identityFetch(session, "/api/admin/tenant/roles?q=&sort=name&dir=asc"), identityFetch(session, "/api/admin/tenant/users?q=&sort=email&dir=asc")]);
	const counts = Object.fromEntries(rolesResult.roles.map((role) => [role.id, 0]));
	for (const roleIds of Object.values(usersResult.assignedRoleIds)) for (const roleId of roleIds) counts[roleId] = (counts[roleId] ?? 0) + 1;
	setRoles(rolesResult.roles);
	setPermissions(rolesResult.permissions);
	setAssignedPermissionIds(rolesResult.assignedPermissionIds);
	setUserCounts(counts);
}
//#endregion
export { RolesPage as component };
