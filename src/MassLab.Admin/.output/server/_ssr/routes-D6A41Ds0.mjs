import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { E as Globe, S as Lock, W as Building2, Y as ArrowRight, at as CircleCheck, d as Shield, r as Users, t as Zap, w as Key } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-footer-CVBThrO-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D6A41Ds0.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 -z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-[0.06] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand opacity-[0.04] blur-3xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-6 py-20 md:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "mb-6 gap-1.5 px-3 py-1.5 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-gradient-brand" }), t("home.badge")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl",
							children: [
								t("home.hero1"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient-brand",
									children: t("home.hero2")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg text-muted-foreground md:text-xl",
							children: t("home.heroSub")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "h-12 gap-2 bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth",
									children: [
										t("home.startFree"),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								className: "h-12",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									children: t("home.seeDemo")
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted-foreground",
							children: t("home.noCc")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto mt-16 max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-gradient-brand opacity-10 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border border-border bg-card shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-10 items-center gap-2 border-b border-border bg-muted/30 px-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-red-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-yellow-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-green-400" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/20 p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid h-full gap-4 md:grid-cols-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden rounded-lg border border-border bg-background/80 md:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-3 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-4 md:grid-cols-3",
										children: [
											"12,847",
											"156",
											"99.99%"
										].map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-background/80 p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-2xl font-bold text-gradient-brand",
												children: v
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-3 w-16 rounded bg-muted" })]
										}, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-background/80 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 h-4 w-24 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-2",
											children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 rounded bg-muted/50" }, i))
										})]
									})]
								})]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-bold tracking-tight md:text-4xl",
							children: t("home.featuresTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground",
							children: t("home.featuresSub")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Shield,
								title: t("home.f1Title"),
								description: t("home.f1Desc")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Users,
								title: t("home.f2Title"),
								description: t("home.f2Desc")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Key,
								title: t("home.f3Title"),
								description: t("home.f3Desc")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Building2,
								title: t("home.f4Title"),
								description: t("home.f4Desc")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Lock,
								title: t("home.f5Title"),
								description: t("home.f5Desc")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: Zap,
								title: t("home.f6Title"),
								description: t("home.f6Desc")
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 rounded-2xl border border-border bg-gradient-brand-soft p-8 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: "12,000+",
							label: t("home.statTenants")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: "4.8M",
							label: t("home.statIdentities")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: "99.99%",
							label: t("home.statUptime")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: "50ms",
							label: t("home.statLatency")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-bold tracking-tight md:text-4xl",
							children: t("home.testimonialsTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground",
							children: t("home.testimonialsSub")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid gap-6 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
								quote: t("home.t1Quote"),
								author: t("home.t1Author"),
								role: t("home.t1Role"),
								company: "Contoso Bank"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
								quote: t("home.t2Quote"),
								author: t("home.t2Author"),
								role: t("home.t2Role"),
								company: "Acme Corp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
								quote: t("home.t3Quote"),
								author: t("home.t3Author"),
								role: t("home.t3Role"),
								company: "Northwind Labs"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center justify-center gap-8 text-muted-foreground",
					children: [
						"SOC 2 Type II",
						"ISO 27001",
						"GDPR",
						"HIPAA",
						"PCI DSS"
					].map((cert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-success" }), cert]
					}, cert))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6 py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold tracking-tight md:text-4xl",
								children: t("home.ctaTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg text-muted-foreground",
								children: t("home.ctaSub")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "h-12 gap-2 bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/auth",
										children: [
											t("home.getStarted"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "lg",
									className: "h-12 gap-2",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/auth",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }),
											" ",
											t("home.seeDemo")
										]
									})
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function FeatureCard({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "group border-border bg-card shadow-card transition-all hover:border-primary/30 hover:shadow-elegant",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: description
				})
			]
		})
	});
}
function StatCard({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-3xl font-bold text-gradient-brand md:text-4xl",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-sm text-muted-foreground",
			children: label
		})]
	});
}
function TestimonialCard({ quote, author, role, company }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border bg-card shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: [
					"\"",
					quote,
					"\""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-primary-foreground",
					children: author.split(" ").map((n) => n[0]).join("")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: author
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						role,
						", ",
						company
					]
				})] })]
			})]
		})
	});
}
//#endregion
export { HomePage as component };
