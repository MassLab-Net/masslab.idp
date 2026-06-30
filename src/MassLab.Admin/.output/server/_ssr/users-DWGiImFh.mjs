import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as PageHeader } from "./organizations-DNmoE0r-.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { n as statusVariant, t as StatusPill } from "./status-pill-BlcI5odm.mjs";
import { h as Search, rt as Ellipsis, v as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { t as Checkbox } from "./checkbox-S7S1jDr4.mjs";
import { t as identityFetch } from "./identity-api-DHRTF7en.mjs";
import { a as initials } from "./app-sidebar-DWLue5Me.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-cKdyAgSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-DWGiImFh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	const { t } = useI18n();
	const { session } = useAuth();
	const [q, setQ] = (0, import_react.useState)("");
	const [users, setUsers] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [assignedRoleIds, setAssignedRoleIds] = (0, import_react.useState)({});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [assigningUserId, setAssigningUserId] = (0, import_react.useState)(null);
	const [selectedRoleIds, setSelectedRoleIds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
	}, [session]);
	const filtered = (0, import_react.useMemo)(() => users.filter((user) => !q || user.displayName.toLowerCase().includes(q.toLowerCase()) || (user.email ?? "").toLowerCase().includes(q.toLowerCase())), [users, q]);
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("users.title"),
				subtitle: t("users.subtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing({
						email: "",
						displayName: "",
						password: "",
						isEnabled: true,
						isTenantAdmin: false
					}),
					className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
						" ",
						t("users.invite")
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[220px] max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (event) => setQ(event.target.value),
							placeholder: t("users.search"),
							className: "h-9 pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto text-sm text-muted-foreground",
						children: [
							filtered.length,
							" ",
							t("common.of"),
							" ",
							users.length
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("users.col.user") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("users.col.roles") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("users.col.status") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("users.col.org") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((user) => {
					const userRoleIds = assignedRoleIds[user.id] ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground",
								children: initials(user.displayName)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: user.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: user.email
							})] })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: userRoleIds.map((roleId) => {
								const role = roles.find((item) => item.id === roleId);
								return role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "font-normal",
									children: role.name
								}, roleId) : null;
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							variant: statusVariant(user.isEnabled ? "Active" : "Disabled"),
							children: user.isEnabled ? "Active" : "Disabled"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm text-muted-foreground",
							children: user.isSystemAdmin ? "System" : user.isTenantAdmin ? "Tenant" : "User"
						}),
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
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => setEditing({
											id: user.id,
											email: user.email ?? "",
											displayName: user.displayName,
											password: "",
											isEnabled: user.isEnabled,
											isTenantAdmin: user.isTenantAdmin
										}),
										children: t("common.edit")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											setAssigningUserId(user.id);
											setSelectedRoleIds(userRoleIds);
										},
										children: t("users.tab.roles")
									}),
									!user.isEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											setEditing({
												id: user.id,
												email: user.email ?? "",
												displayName: user.displayName,
												password: "",
												isEnabled: true,
												isTenantAdmin: user.isTenantAdmin
											});
										},
										children: "Enable"
									}),
									user.isEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: async () => {
											try {
												await identityFetch(session, `/api/admin/tenant/users/${user.id}/disable`, { method: "POST" });
												toast.success("User disabled.");
												await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
											} catch (reason) {
												toast.error(reason instanceof Error ? reason.message : "Unable to disable the user.");
											}
										},
										children: "Disable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "text-destructive",
										onClick: async () => {
											try {
												await identityFetch(session, `/api/admin/tenant/users/${user.id}/delete`, { method: "POST" });
												toast.success(t("users.deleted"));
												await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
											} catch (reason) {
												toast.error(reason instanceof Error ? reason.message : "Unable to delete the user.");
											}
										},
										children: t("common.delete")
									})
								]
							})] })
						})
					] }, user.id);
				}) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (open) => !open && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? t("users.editTitle") : t("users.inviteTitle") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("users.fullName") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing?.displayName ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										displayName: event.target.value
									} : current)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("users.email") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing?.email ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										email: event.target.value
									} : current)
								})]
							}),
							!editing?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("login.password") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: editing?.password ?? "",
									onChange: (event) => setEditing((current) => current ? {
										...current,
										password: event.target.value
									} : current)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: editing?.isEnabled ?? true,
									onCheckedChange: (checked) => setEditing((current) => current ? {
										...current,
										isEnabled: checked === true
									} : current)
								}), "Enabled"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: editing?.isTenantAdmin ?? false,
									onCheckedChange: (checked) => setEditing((current) => current ? {
										...current,
										isTenantAdmin: checked === true
									} : current)
								}), "Tenant administrator"]
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
								if (editing.id) await identityFetch(session, `/api/admin/tenant/users/${editing.id}/edit`, {
									method: "POST",
									body: JSON.stringify({
										email: editing.email,
										displayName: editing.displayName,
										isEnabled: editing.isEnabled,
										isTenantAdmin: editing.isTenantAdmin
									})
								});
								else await identityFetch(session, "/api/admin/tenant/users", {
									method: "POST",
									body: JSON.stringify({
										email: editing.email,
										displayName: editing.displayName,
										password: editing.password,
										isTenantAdmin: editing.isTenantAdmin
									})
								});
								toast.success(editing.id ? t("users.updated") : t("users.invited"));
								setEditing(null);
								await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
							} catch (reason) {
								toast.error(reason instanceof Error ? reason.message : "Unable to save the user.");
							}
						},
						children: editing?.id ? t("common.save") : t("users.invite")
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!assigningUserId,
				onOpenChange: (open) => !open && setAssigningUserId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("users.tab.roles") }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 py-2",
						children: roles.map((role) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-3 rounded-lg border border-border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: selectedRoleIds.includes(role.id),
									onCheckedChange: (value) => {
										setSelectedRoleIds((current) => value === true ? [...current, role.id] : current.filter((item) => item !== role.id));
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: role.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: role.description
								})] })]
							}, role.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setAssigningUserId(null),
						children: t("common.cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-primary-foreground",
						onClick: async () => {
							if (!assigningUserId) return;
							try {
								await identityFetch(session, `/api/admin/tenant/users/${assigningUserId}/roles`, {
									method: "POST",
									body: JSON.stringify({ roleIds: selectedRoleIds })
								});
								toast.success("User roles updated.");
								setAssigningUserId(null);
								await loadUsers(session, setUsers, setRoles, setAssignedRoleIds);
							} catch (reason) {
								toast.error(reason instanceof Error ? reason.message : "Unable to update user roles.");
							}
						},
						children: t("common.save")
					})] })
				] })
			})
		]
	});
}
async function loadUsers(session, setUsers, setRoles, setAssignedRoleIds) {
	const result = await identityFetch(session, "/api/admin/tenant/users?q=&sort=email&dir=asc");
	setUsers(result.users);
	setRoles(result.roles);
	setAssignedRoleIds(result.assignedRoleIds);
}
//#endregion
export { UsersPage as component };
