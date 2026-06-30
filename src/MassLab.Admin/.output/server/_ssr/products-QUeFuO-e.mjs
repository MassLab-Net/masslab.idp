import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./organizations-DNmoE0r-.mjs";
import { t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { t as StatusPill } from "./status-pill-BlcI5odm.mjs";
import { J as ArrowUpDown, h as Search, l as SlidersHorizontal, n as X, rt as Ellipsis, v as Plus, y as Package } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C9T31-X3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { a as getProductTitle, i as getProductDescription, n as deleteProduct, s as useProducts } from "./product-store-DwaJLS0o.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-CEsLMvuZ.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Cot7DC_T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-QUeFuO-e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function productStatusVariant(status) {
	if (status === "Active") return "success";
	if (status === "Draft") return "warning";
	return "neutral";
}
function compareProducts(a, b, key, dir, lang) {
	const va = key === "name" ? getProductTitle(a, lang) : a[key];
	const vb = key === "name" ? getProductTitle(b, lang) : b[key];
	const left = typeof va === "string" ? va.toLowerCase() : va;
	const right = typeof vb === "string" ? vb.toLowerCase() : vb;
	if (left < right) return dir === "asc" ? -1 : 1;
	if (left > right) return dir === "asc" ? 1 : -1;
	return 0;
}
function ProductsPage() {
	const { t, lang } = useI18n();
	const products = useProducts();
	const [q, setQ] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [sortKey, setSortKey] = (0, import_react.useState)("createdAt");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	const [page, setPage] = (0, import_react.useState)(1);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const pageSize = 8;
	const activeFilters = (categoryFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return [...products].filter((product) => {
			const matchesQuery = !query || product.translations.en.name.toLowerCase().includes(query) || product.translations.vi.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query) || product.tags.some((tag) => tag.includes(query)) || product.translations.en.description.toLowerCase().includes(query) || product.translations.vi.description.toLowerCase().includes(query);
			const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
			const matchesStatus = statusFilter === "all" || product.status === statusFilter;
			return matchesQuery && matchesCategory && matchesStatus;
		}).sort((a, b) => compareProducts(a, b, sortKey, sortDir, lang));
	}, [
		products,
		q,
		categoryFilter,
		statusFilter,
		sortKey,
		sortDir,
		lang
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
	(0, import_react.useEffect)(() => {
		setPage((current) => Math.min(current, totalPages));
	}, [totalPages]);
	function resetFilters() {
		setCategoryFilter("all");
		setStatusFilter("all");
		setPage(1);
	}
	function toggleSort(key) {
		if (sortKey === key) setSortDir((dir) => dir === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortDir("asc");
		}
		setPage(1);
	}
	function SortBtn({ col }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => toggleSort(col),
			className: "inline-flex items-center gap-1 hover:text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: `h-3 w-3 ${sortKey === col ? "text-primary" : "text-muted-foreground"}` })
		});
	}
	const stats = [
		{
			label: t("products.statTotal"),
			value: products.length
		},
		{
			label: t("products.statActive"),
			value: products.filter((product) => product.status === "Active").length
		},
		{
			label: t("products.statDraft"),
			value: products.filter((product) => product.status === "Draft").length
		},
		{
			label: t("products.statArchived"),
			value: products.filter((product) => product.status === "Archived").length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("products.title"),
				subtitle: t("products.subtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/products/new",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
							" ",
							t("products.new")
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight",
							children: stat.value
						})] })]
					})
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-b border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-[200px] flex-1 max-w-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: q,
									onChange: (e) => {
										setQ(e.target.value);
										setPage(1);
									},
									placeholder: t("products.search"),
									className: "h-9 pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: (value) => {
									setStatusFilter(value);
									setPage(1);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: t("products.filterAllStatus")
									}),
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-9",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "mr-1.5 h-4 w-4" }),
										" ",
										t("products.filters"),
										activeFilters > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "ml-2 h-5 bg-gradient-brand px-1.5 text-[10px] text-primary-foreground",
											children: activeFilters
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								align: "start",
								className: "w-64 p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: t("products.filters")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50",
										onClick: resetFilters,
										disabled: activeFilters === 0,
										children: t("common.reset")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4 p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: t("products.category")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: categoryFilter,
											onValueChange: (value) => {
												setCategoryFilter(value);
												setPage(1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: t("common.all")
												}),
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
									})
								})]
							})] }),
							activeFilters > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-9 text-muted-foreground",
								onClick: resetFilters,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 h-3.5 w-3.5" }),
									" ",
									t("common.reset")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto text-sm text-muted-foreground",
								children: [
									filtered.length,
									" ",
									t("common.of"),
									" ",
									products.length
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("products.colName"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "name" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("products.colSku") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("products.colCategory") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("products.colStatus") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("products.colPrice"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "price" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("products.colStock"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "stock" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("products.colCreated"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "createdAt" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginated.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "cursor-pointer hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/products/$id/edit",
								params: { id: product.id },
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: getProductTitle(product, lang)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: getProductDescription(product, lang)
								})] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-xs text-muted-foreground",
								children: product.sku
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "font-normal",
								children: product.category
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: productStatusVariant(product.status),
								children: product.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: product.currency
								}).format(product.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: product.stock === 0 ? "font-medium text-destructive" : product.stock < 20 ? "font-medium text-warning" : "",
								children: product.stock === 0 ? t("products.outOfStock") : product.stock
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm text-muted-foreground",
								children: product.createdAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								onClick: (e) => e.stopPropagation(),
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
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/products/$id/edit",
											params: { id: product.id },
											children: t("common.edit")
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "text-destructive",
										onClick: () => setDeleteTarget(product),
										children: t("common.delete")
									})]
								})] })
							})
						]
					}, product.id)), paginated.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 8,
						className: "py-12 text-center text-muted-foreground",
						children: t("products.empty")
					}) })] })] }),
					totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								t("products.page"),
								" ",
								page,
								" / ",
								totalPages
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: page === 1,
									onClick: () => setPage(1),
									children: "«"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: page === 1,
									onClick: () => setPage((current) => current - 1),
									children: "‹"
								}),
								Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
									const number = Math.max(1, Math.min(page - 2, totalPages - 4)) + index;
									if (number > totalPages) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: number === page ? "default" : "outline",
										size: "sm",
										className: number === page ? "bg-gradient-brand text-primary-foreground" : "",
										onClick: () => setPage(number),
										children: number
									}, number);
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: page === totalPages,
									onClick: () => setPage((current) => current + 1),
									children: "›"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: page === totalPages,
									onClick: () => setPage(totalPages),
									children: "»"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteTarget,
				onOpenChange: (open) => !open && setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: t("products.deleteTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					t("products.deleteDesc"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: deleteTarget ? getProductTitle(deleteTarget, lang) : ""
					}),
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: t("common.cancel") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					onClick: () => {
						if (!deleteTarget) return;
						deleteProduct(deleteTarget.id);
						toast.success(t("products.deleted"));
						setDeleteTarget(null);
					},
					children: t("common.delete")
				})] })] })
			})
		]
	});
}
//#endregion
export { ProductsPage as component };
