import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-C886EF0p.mjs";
import { A as ExternalLink, F as Code, G as Book, W as Building2, d as Shield, r as Users, t as Zap, w as Key } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-footer-CVBThrO-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-UChwZoEA.js
var import_jsx_runtime = require_jsx_runtime();
function DocsPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-gradient-brand-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-6 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mb-4",
							children: t("docs.badge")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-bold tracking-tight md:text-5xl",
							children: t("docs.title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-2xl text-lg text-muted-foreground",
							children: t("docs.subtitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#quickstart",
									children: t("docs.quickstart")
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://github.com/masslab/iam-sdk",
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "mr-2 h-4 w-4" }), " GitHub SDK"]
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "quickstart",
				className: "mx-auto max-w-6xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: t("docs.gettingStarted")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Zap,
							title: t("docs.gs1Title"),
							description: t("docs.gs1Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Key,
							title: t("docs.gs2Title"),
							description: t("docs.gs2Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Users,
							title: t("docs.gs3Title"),
							description: t("docs.gs3Desc")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: t("docs.coreConcepts")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Users,
							title: t("docs.concept1Title"),
							description: t("docs.concept1Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Shield,
							title: t("docs.concept2Title"),
							description: t("docs.concept2Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Key,
							title: t("docs.concept3Title"),
							description: t("docs.concept3Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Building2,
							title: t("docs.concept4Title"),
							description: t("docs.concept4Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Code,
							title: t("docs.concept5Title"),
							description: t("docs.concept5Desc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocCard, {
							icon: Book,
							title: t("docs.concept6Title"),
							description: t("docs.concept6Desc")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: t("docs.codeExample")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "font-mono text-xs",
							children: "TypeScript"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto p-4 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-muted-foreground",
							children: `import { MassLabIAM } from '@masslab/iam-sdk';

const iam = new MassLabIAM({
  tenantId: 'your-tenant-id',
  apiKey: process.env.MASSLAB_API_KEY,
});

// Check user permissions
const hasAccess = await iam.hasPermission({
  userId: 'usr_123',
  permission: 'iam.users.write',
});

console.log(hasAccess); // true or false

// List all roles for a tenant
const roles = await iam.roles.list();
console.log(roles);
// [{ id: 'role_admin', name: 'Administrator', ... }]`
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: t("docs.apiRef")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: [
						{
							method: "GET",
							path: "/v1/users",
							desc: t("docs.apiUsers")
						},
						{
							method: "POST",
							path: "/v1/users",
							desc: t("docs.apiUsersCreate")
						},
						{
							method: "GET",
							path: "/v1/roles",
							desc: t("docs.apiRoles")
						},
						{
							method: "POST",
							path: "/v1/roles",
							desc: t("docs.apiRolesCreate")
						},
						{
							method: "GET",
							path: "/v1/permissions",
							desc: t("docs.apiPerms")
						},
						{
							method: "POST",
							path: "/v1/check",
							desc: t("docs.apiCheck")
						}
					].map((api) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-lg border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: `font-mono text-xs ${api.method === "GET" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`,
								children: api.method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "flex-1 font-mono text-sm",
								children: api.path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: api.desc
							})
						]
					}, api.path))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: t("docs.sdks")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SdkCard, {
							name: "TypeScript / Node.js",
							href: "https://npmjs.com/package/@masslab/iam-sdk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SdkCard, {
							name: "Python",
							href: "https://pypi.org/project/masslab-iam"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SdkCard, {
							name: "Go",
							href: "https://github.com/masslab/iam-go"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function DocCard({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card shadow-card transition-all hover:border-primary/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: description
		}) })]
	});
}
function SdkCard({ name, href }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 text-muted-foreground" })]
	});
}
//#endregion
export { DocsPage as component };
