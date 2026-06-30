import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { n as statusVariant, t as StatusPill } from "./status-pill-BlcI5odm.mjs";
import { W as Building2, h as Search, rt as Ellipsis, v as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useAuth } from "./auth-CZt5-1jc.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { t as identityFetch } from "./identity-api-DHRTF7en.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-cKdyAgSG.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Cot7DC_T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/organizations-D-o24TSc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Organizations() {
	const { t } = useI18n();
	const { session } = useAuth();
	const [orgs, setOrgs] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [hostName, setHostName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!session) return;
		loadOrganizations(session, setOrgs);
	}, [session]);
	const filtered = (0, import_react.useMemo)(() => orgs.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()) || o.slug.toLowerCase().includes(q.toLowerCase())), [orgs, q]);
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("org.title"),
				subtitle: t("org.subtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
								" ",
								t("org.new")
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("org.create") }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("org.name") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: name,
										onChange: (event) => setName(event.target.value),
										placeholder: "Acme Corporation"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("org.subdomain") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: slug,
										onChange: (event) => setSlug(event.target.value),
										placeholder: "acme"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Host name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: hostName,
										onChange: (event) => setHostName(event.target.value),
										placeholder: "acme.localhost"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: t("common.cancel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-gradient-brand text-primary-foreground",
							onClick: async () => {
								try {
									await identityFetch(session, "/api/admin/system/tenants", {
										method: "POST",
										body: JSON.stringify({
											name,
											slug,
											hostName
										})
									});
									setOpen(false);
									setName("");
									setSlug("");
									setHostName("");
									toast.success(t("org.created"));
									await loadOrganizations(session, setOrgs);
								} catch (reason) {
									toast.error(reason instanceof Error ? reason.message : "Unable to create the organization.");
								}
							},
							children: t("common.create")
						})] })
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						l: t("org.stat.total"),
						v: orgs.length
					},
					{
						l: t("org.stat.ent"),
						v: orgs.filter((o) => o.isActive).length
					},
					{
						l: t("org.stat.active"),
						v: orgs.filter((o) => o.isActive).length.toLocaleString()
					},
					{
						l: t("org.stat.suspended"),
						v: orgs.filter((o) => !o.isActive).length
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 border-b border-border p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (event) => setQ(event.target.value),
							placeholder: t("org.search"),
							className: "h-9 pl-9"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("org.col.org") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("org.col.plan") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("org.col.members") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("org.col.status") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("org.col.created") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((org) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: org.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs text-muted-foreground",
							children: org.primaryHostName ?? `${org.slug}.localhost`
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						variant: statusVariant(org.isActive ? "Business" : "Suspended"),
						children: org.slug
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						variant: statusVariant(org.isActive ? "Active" : "Suspended"),
						children: org.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: "-"
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: async () => {
									try {
										await identityFetch(session, `/api/admin/system/tenants/${org.id}/toggle`, { method: "POST" });
										toast.success("Organization status updated.");
										await loadOrganizations(session, setOrgs);
									} catch (reason) {
										toast.error(reason instanceof Error ? reason.message : "Unable to update the organization.");
									}
								},
								children: "Toggle status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								className: "text-destructive",
								onClick: () => setDeleteTarget(org),
								children: t("common.delete")
							})]
						})] })
					})
				] }, org.id)) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteTarget,
				onOpenChange: (nextOpen) => !nextOpen && setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: t("org.deleteTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					t("org.deleteDesc"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: deleteTarget?.name ?? ""
					}),
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: t("common.cancel") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					onClick: () => {
						toast.info("Organization deletion is not exposed by the Identity API yet.");
						setDeleteTarget(null);
					},
					children: t("common.delete")
				})] })] })
			})
		]
	});
}
async function loadOrganizations(session, setOrgs) {
	setOrgs(await identityFetch(session, "/api/admin/system/tenants"));
}
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight md:text-3xl",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: subtitle
		})] }), action]
	});
}
//#endregion
export { PageHeader, Organizations as component };
