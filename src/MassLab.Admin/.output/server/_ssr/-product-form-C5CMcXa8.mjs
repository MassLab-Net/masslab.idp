import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn, t as Button } from "./button-BPK1zgJN.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { t as Textarea } from "./textarea-CxCjlOsm.mjs";
import { t as Separator } from "./separator-DDlQh6CO.mjs";
import { X as ArrowLeft, c as Tag, n as X } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C9T31-X3.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/-product-form-C5CMcXa8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function ProductForm({ initial, onSubmit, isSaving, title, backTo = "/admin/products/" }) {
	const { t } = useI18n();
	const [form, setForm] = (0, import_react.useState)(initial);
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)({});
	const locales = ["en", "vi"];
	(0, import_react.useEffect)(() => {
		setForm(initial);
		setTagInput("");
		setErrors({});
	}, [initial]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
		setErrors((e) => ({
			...e,
			[key]: void 0
		}));
	}
	function setTranslation(lang, key, value) {
		setForm((f) => ({
			...f,
			translations: {
				...f.translations,
				[lang]: {
					...f.translations[lang],
					[key]: value
				}
			}
		}));
	}
	function addTag() {
		const tag = tagInput.trim().toLowerCase();
		if (!tag || form.tags.includes(tag)) {
			setTagInput("");
			return;
		}
		set("tags", [...form.tags, tag]);
		setTagInput("");
	}
	function removeTag(tag) {
		set("tags", form.tags.filter((t) => t !== tag));
	}
	function validate() {
		const errs = {};
		if (!form.sku.trim()) errs.sku = t("products.errSku");
		if (form.price < 0) errs.price = t("products.errPrice");
		if (form.stock < 0) errs.stock = t("products.errStock");
		if (locales.some((lang) => !form.translations[lang].name.trim())) errs.translations = t("products.errName");
		setErrors(errs);
		return Object.keys(errs).length === 0;
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit(form);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				asChild: true,
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: backTo,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight md:text-3xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm text-muted-foreground",
				children: t("products.formSubtitle")
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
			onSubmit: handleSubmit,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("products.sectionBasic")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "sku",
												children: [
													t("products.colSku"),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive",
														children: "*"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "sku",
												value: form.sku,
												onChange: (e) => set("sku", e.target.value),
												placeholder: "ML-01001"
											}),
											errors.sku && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-destructive",
												children: errors.sku
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("products.category") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.category,
											onValueChange: (v) => set("category", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Software",
													children: "Software"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Hardware",
													children: "Hardware"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Service",
													children: "Service"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Subscription",
													children: "Subscription"
												})
											] })]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("products.localization") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
											defaultValue: "en",
											className: "w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
												className: "grid w-full grid-cols-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
													value: "en",
													children: "English"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
													value: "vi",
													children: "Tiếng Việt"
												})]
											}), locales.map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
												value: lang,
												className: "mt-4 space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														htmlFor: `name-${lang}`,
														children: [
															t("products.colName"),
															" (",
															lang.toUpperCase(),
															") ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-destructive",
																children: "*"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: `name-${lang}`,
														value: form.translations[lang].name,
														onChange: (e) => setTranslation(lang, "name", e.target.value),
														placeholder: lang === "en" ? "IAM Enterprise Suite" : "Bộ IAM doanh nghiệp"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														htmlFor: `description-${lang}`,
														children: [
															t("products.description"),
															" (",
															lang.toUpperCase(),
															")"
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
														id: `description-${lang}`,
														rows: 3,
														value: form.translations[lang].description,
														onChange: (e) => setTranslation(lang, "description", e.target.value),
														placeholder: t("products.descriptionPlaceholder")
													})]
												})]
											}, lang))]
										}),
										errors.translations && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.translations
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("products.sectionPricing")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "grid gap-4 md:grid-cols-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 md:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "price",
											children: [
												t("products.price"),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
												children: "$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "price",
												type: "number",
												min: 0,
												step: .01,
												value: form.price,
												onChange: (e) => set("price", parseFloat(e.target.value) || 0),
												className: "pl-7"
											})]
										}),
										errors.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.price
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("products.currency") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.currency,
										onValueChange: (v) => set("currency", v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "USD",
												children: "USD"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "EUR",
												children: "EUR"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "VND",
												children: "VND"
											})
										] })]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("products.sectionTags")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: tagInput,
											onChange: (e) => setTagInput(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addTag();
												}
											},
											placeholder: t("products.tagPlaceholder"),
											className: "pl-9"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: addTag,
										children: t("products.addTag")
									})]
								}), form.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: form.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "gap-1.5 pr-1",
										children: [tag, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeTag(tag),
											className: "rounded hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										})]
									}, tag))
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: t("products.sectionStatus")
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("products.colStatus") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status,
										onValueChange: (v) => set("status", v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Active",
												children: t("products.statusActive")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Draft",
												children: t("products.statusDraft")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Archived",
												children: t("products.statusArchived")
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "stock",
											children: t("products.colStock")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "stock",
											type: "number",
											min: 0,
											value: form.stock,
											onChange: (e) => set("stock", parseInt(e.target.value) || 0)
										}),
										errors.stock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.stock
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSaving,
							className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
							children: isSaving ? t("products.saving") : t("products.save")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: backTo,
								children: t("common.cancel")
							})
						})]
					})]
				})]
			})
		})]
	});
}
//#endregion
export { ProductForm as t };
