import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { O as Eye, W as Building2, k as EyeOff, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as getStoredSession, r as useAuth } from "./auth-CZt5-1jc.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { t as Checkbox } from "./checkbox-S7S1jDr4.mjs";
import { t as Logo } from "./logo-CGem-MrE.mjs";
import { r as completeLogin, t as beginLogin } from "./oidc-Drkv9Zoo.mjs";
import { t as Flag } from "./flag-gbFpOcqo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CrLi53Gw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { t, lang, setLang } = useI18n();
	const navigate = useNavigate();
	const { signIn } = useAuth();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [org, setOrg] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(null);
	const [callbackError, setCallbackError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const url = new URL(window.location.href);
		if (!(url.searchParams.has("code") || url.searchParams.has("error"))) {
			if (getStoredSession()) navigate({
				to: "/admin/dashboard",
				replace: true
			});
			return;
		}
		let cancelled = false;
		setLoading("pw");
		setCallbackError(null);
		completeLogin(window.location.href).then(({ session, returnTo }) => {
			if (cancelled) return;
			signIn(session);
			const cleanUrl = new URL(window.location.href);
			cleanUrl.search = "";
			cleanUrl.hash = "";
			window.history.replaceState({}, document.title, cleanUrl.pathname);
			navigate({
				to: returnTo,
				replace: true
			});
		}).catch((reason) => {
			if (cancelled) return;
			setLoading(null);
			setCallbackError(reason instanceof Error ? reason.message : "Unable to complete sign-in.");
		});
		return () => {
			cancelled = true;
		};
	}, [navigate, signIn]);
	const submit = async (kind) => {
		setLoading(kind);
		setCallbackError(null);
		toast.info(kind === "pw" ? "Redirecting to MassLab Identity..." : "Continuing with MassLab Identity...");
		beginLogin({
			organizationSlug: org.trim() || void 0,
			returnTo: "/admin/dashboard"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 -z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-brand opacity-[0.10] blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "grid min-h-screen grid-cols-1 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center px-6 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 flex flex-col items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
								size: 48,
								showWord: true
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							callbackError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
								children: callbackError
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "org",
									children: t("login.org")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "org",
											value: org,
											onChange: (e) => setOrg(e.target.value),
											placeholder: t("login.orgPlaceholder"),
											className: "h-11 pl-9 pr-32",
											autoComplete: "organization"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground",
											children: ".masslab.io"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "username",
									children: t("login.username")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "username",
									autoComplete: "username",
									placeholder: "you@company.com",
									value: username,
									onChange: (e) => setUsername(e.target.value),
									className: "h-11"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: t("login.password")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs font-medium text-primary hover:underline",
										onClick: () => toast.info(t("login.recovery")),
										children: t("login.forgot")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: showPw ? "text" : "password",
										autoComplete: "current-password",
										placeholder: "••••••••••",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "h-11 pr-10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPw((s) => !s),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										"aria-label": "toggle password",
										children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { id: "remember" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "remember",
									className: "text-sm text-muted-foreground font-normal",
									children: t("login.remember")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => submit("pw"),
								disabled: !!loading,
								className: "h-11 w-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
								children: loading === "pw" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("login.signin")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative flex justify-center text-xs uppercase tracking-wider",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-background px-3 text-muted-foreground",
										children: t("login.or")
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 w-full justify-center gap-3",
									onClick: () => submit("google"),
									disabled: !!loading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), loading === "google" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("login.google")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 w-full justify-center gap-3",
									onClick: () => submit("entra"),
									disabled: !!loading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntraIcon, {}), loading === "entra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("login.entra")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "pt-2 text-center text-sm text-muted-foreground",
								children: [
									t("login.new"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/register",
										className: "font-semibold text-primary hover:underline",
										children: t("login.register")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-8 gap-2 text-muted-foreground hover:text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
											lang,
											className: "h-3.5 w-5 rounded-sm shadow-sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: lang === "vi" ? "Tiếng Việt" : "English"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "center",
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
												" English",
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
												" Tiếng Việt",
												lang === "vi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-auto text-primary",
													children: "✓"
												})
											]
										})
									]
								})] })
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "relative hidden items-center justify-center overflow-hidden lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 rounded-3xl bg-gradient-brand-soft" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 rounded-3xl border border-border/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 max-w-md px-10 py-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-gradient-brand" }), t("login.tagline")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-6 text-3xl font-bold leading-tight tracking-tight",
								children: [
									t("login.headline1"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient-brand",
										children: t("login.headline2")
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted-foreground",
								children: t("login.body")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid grid-cols-3 gap-3",
								children: [
									{
										k: "12K+",
										v: t("login.stat.tenants")
									},
									{
										k: "4.8M",
										v: t("login.stat.identities")
									},
									{
										k: "99.99%",
										v: t("login.stat.uptime")
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/80 p-4 backdrop-blur",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold text-gradient-brand",
										children: s.k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: s.v
									})]
								}, s.v))
							})
						]
					})
				]
			})]
		})]
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "h-4 w-4",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#EA4335",
			d: "M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8a6 6 0 1 1 0-12c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.8 9.6-7.3 0-.5-.05-.9-.13-1.3H12z"
		})
	});
}
function EntraIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "h-4 w-4",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#0078D4",
			d: "M11.5 2 2 20h6.4l3.1-6.1 3.1 6.1H21L11.5 2z"
		})
	});
}
//#endregion
export { AuthPage as component };
