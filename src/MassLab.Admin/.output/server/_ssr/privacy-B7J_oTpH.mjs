import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { O as Eye, P as Cookie, S as Lock, b as Mail, d as Shield, g as Scale, j as Database, r as Users } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-footer-CVBThrO-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-B7J_oTpH.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showAuth: false }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-gradient-brand-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-6 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "mb-4 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), t("privacy.badge")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold tracking-tight md:text-4xl",
							children: t("privacy.title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground",
							children: t("privacy.subtitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: t("privacy.lastUpdated")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-6 py-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: t("privacy.contents")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Database,
								label: t("privacy.collectTitle"),
								href: "#collect"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Eye,
								label: t("privacy.useTitle"),
								href: "#use"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Lock,
								label: t("privacy.securityTitle"),
								href: "#security"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Users,
								label: t("privacy.rightsTitle"),
								href: "#rights"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-4xl px-6 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							id: "intro",
							title: t("privacy.introTitle"),
							icon: Shield,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: t("privacy.introDesc")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							id: "collect",
							title: t("privacy.collectTitle"),
							icon: Database,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-4 text-muted-foreground",
								children: t("privacy.collectDesc")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
										title: t("privacy.collect1Title"),
										desc: t("privacy.collect1Desc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
										title: t("privacy.collect2Title"),
										desc: t("privacy.collect2Desc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
										title: t("privacy.collect3Title"),
										desc: t("privacy.collect3Desc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
										title: t("privacy.collect4Title"),
										desc: t("privacy.collect4Desc")
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							id: "use",
							title: t("privacy.useTitle"),
							icon: Eye,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-4 text-muted-foreground",
								children: t("privacy.useDesc")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "ml-4 list-disc space-y-2 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("privacy.use1") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("privacy.use2") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("privacy.use3") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("privacy.use4") })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							id: "share",
							title: t("privacy.shareTitle"),
							icon: Users,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: t("privacy.shareDesc")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							id: "security",
							title: t("privacy.securityTitle"),
							icon: Lock,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: t("privacy.securityDesc")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							id: "rights",
							title: t("privacy.rightsTitle"),
							icon: Scale,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-4 text-muted-foreground",
								children: t("privacy.rightsDesc")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightCard, {
										title: t("privacy.rights1Title"),
										desc: t("privacy.rights1Desc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightCard, {
										title: t("privacy.rights2Title"),
										desc: t("privacy.rights2Desc")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightCard, {
										title: t("privacy.rights3Title"),
										desc: t("privacy.rights3Desc")
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							id: "cookies",
							title: t("privacy.cookiesTitle"),
							icon: Cookie,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: t("privacy.cookiesDesc")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							id: "contact",
							title: t("privacy.contactTitle"),
							icon: Mail,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: t("privacy.contactDesc")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "mt-4",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:privacy@masslab.io",
									children: "privacy@masslab.io"
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function NavItem({ icon: Icon, label, href }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		className: "flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:border-primary/30 hover:bg-accent",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: label
		})]
	});
}
function Section({ id, title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "scroll-mt-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: title
			})]
		}), children]
	});
}
function InfoCard({ title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border bg-card/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: desc
			})]
		})
	});
}
function RightCard({ title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-gradient-brand-soft p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-muted-foreground",
			children: desc
		})]
	});
}
//#endregion
export { PrivacyPage as component };
