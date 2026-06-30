import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./organizations-DNmoE0r-.mjs";
import { r as cn, t as Button } from "./button-BPK1zgJN.mjs";
import { n as CardContent, t as Card } from "./card-C886EF0p.mjs";
import { t as Input } from "./input-BYcV5Phs.mjs";
import { t as Label } from "./label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DdpCoWi7.mjs";
import { t as StatusPill } from "./status-pill-BlcI5odm.mjs";
import { I as Clock3, J as ArrowUpDown, R as CircleDollarSign, l as SlidersHorizontal, n as X, rt as Ellipsis, s as Truck, u as ShoppingCart } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C9T31-X3.mjs";
import { r as useOrders } from "./order-store-JUgtU0IN.mjs";
import { t as Badge } from "./badge-KS2SooOw.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BuTtChvS.mjs";
import { a as initials } from "./app-sidebar-DWLue5Me.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-CEsLMvuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-JfTG8UqX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function statusVariant(status) {
	const v = status.toLowerCase();
	if (v === "delivered" || v === "paid" || v === "fulfilled") return "success";
	if (v === "processing" || v === "shipped" || v === "partial") return "info";
	if (v === "pending" || v === "unfulfilled") return "warning";
	if (v === "cancelled" || v === "failed" || v === "refunded") return "danger";
	return "neutral";
}
var orderStatusLabelKey = {
	Pending: "orders.status.pending",
	Processing: "orders.status.processing",
	Shipped: "orders.status.shipped",
	Delivered: "orders.status.delivered",
	Cancelled: "orders.status.cancelled",
	Refunded: "orders.status.refunded"
};
var paymentStatusLabelKey = {
	Pending: "orders.payment.pending",
	Paid: "orders.payment.paid",
	Failed: "orders.payment.failed",
	Refunded: "orders.payment.refunded"
};
var fulfillmentStatusLabelKey = {
	Unfulfilled: "orders.fulfillment.unfulfilled",
	Partial: "orders.fulfillment.partial",
	Fulfilled: "orders.fulfillment.fulfilled"
};
function compareOrders(a, b, key, dir) {
	const va = a[key];
	const vb = b[key];
	const left = typeof va === "string" ? va.toLowerCase() : va;
	const right = typeof vb === "string" ? vb.toLowerCase() : vb;
	if (left < right) return dir === "asc" ? -1 : 1;
	if (left > right) return dir === "asc" ? 1 : -1;
	return 0;
}
function OrdersPage() {
	const { t } = useI18n();
	const orders = useOrders();
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [paymentFilter, setPaymentFilter] = (0, import_react.useState)("all");
	const [fulfillmentFilter, setFulfillmentFilter] = (0, import_react.useState)("all");
	const [sortKey, setSortKey] = (0, import_react.useState)("createdAt");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 8;
	const activeFilters = (statusFilter !== "all" ? 1 : 0) + (paymentFilter !== "all" ? 1 : 0) + (fulfillmentFilter !== "all" ? 1 : 0);
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return [...orders].filter((order) => {
			const matchesQuery = !query || order.number.toLowerCase().includes(query) || order.customerName.toLowerCase().includes(query) || order.customerEmail.toLowerCase().includes(query) || order.organization.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query));
			const matchesStatus = statusFilter === "all" || order.status === statusFilter;
			const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
			const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillmentStatus === fulfillmentFilter;
			return matchesQuery && matchesStatus && matchesPayment && matchesFulfillment;
		}).sort((a, b) => compareOrders(a, b, sortKey, sortDir));
	}, [
		orders,
		q,
		statusFilter,
		paymentFilter,
		fulfillmentFilter,
		sortKey,
		sortDir
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
	(0, import_react.useEffect)(() => {
		setPage((current) => Math.min(current, totalPages));
	}, [totalPages]);
	function resetFilters() {
		setStatusFilter("all");
		setPaymentFilter("all");
		setFulfillmentFilter("all");
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: cn("h-3 w-3", sortKey === col ? "text-primary" : "text-muted-foreground") })
		});
	}
	const revenue = orders.reduce((sum, order) => sum + order.total, 0);
	const stats = [
		{
			label: t("orders.stat.total"),
			value: orders.length,
			icon: ShoppingCart
		},
		{
			label: t("orders.stat.revenue"),
			value: new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD"
			}).format(revenue),
			icon: CircleDollarSign
		},
		{
			label: t("orders.stat.pending"),
			value: orders.filter((o) => o.status === "Pending" || o.status === "Processing").length,
			icon: Clock3
		},
		{
			label: t("orders.stat.fulfilled"),
			value: orders.filter((o) => o.fulfillmentStatus === "Fulfilled").length,
			icon: Truck
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: t("orders.title"),
				subtitle: t("orders.subtitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, { className: "h-5 w-5" })
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
								className: "relative min-w-[220px] flex-1 max-w-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: q,
									onChange: (e) => {
										setQ(e.target.value);
										setPage(1);
									},
									placeholder: t("orders.search"),
									className: "h-9 pl-9"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: (v) => {
									setStatusFilter(v);
									setPage(1);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: t("orders.filter.statusAll")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Pending",
										children: t("orders.status.pending")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Processing",
										children: t("orders.status.processing")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Shipped",
										children: t("orders.status.shipped")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Delivered",
										children: t("orders.status.delivered")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Cancelled",
										children: t("orders.status.cancelled")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Refunded",
										children: t("orders.status.refunded")
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
										t("orders.filters"),
										activeFilters > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "ml-2 h-5 bg-gradient-brand px-1.5 text-[10px] text-primary-foreground",
											children: activeFilters
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								align: "start",
								className: "w-72 p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: t("orders.filters")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50",
										onClick: resetFilters,
										disabled: activeFilters === 0,
										children: t("common.reset")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: t("orders.filter.payment")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: paymentFilter,
											onValueChange: (v) => {
												setPaymentFilter(v);
												setPage(1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: t("orders.filter.paymentAll")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Pending",
													children: t("orders.payment.pending")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Paid",
													children: t("orders.payment.paid")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Failed",
													children: t("orders.payment.failed")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Refunded",
													children: t("orders.payment.refunded")
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: t("orders.filter.fulfillment")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: fulfillmentFilter,
											onValueChange: (v) => {
												setFulfillmentFilter(v);
												setPage(1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: t("orders.filter.fulfillmentAll")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Unfulfilled",
													children: t("orders.fulfillment.unfulfilled")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Partial",
													children: t("orders.fulfillment.partial")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Fulfilled",
													children: t("orders.fulfillment.fulfilled")
												})
											] })]
										})]
									})]
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
									orders.length
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("orders.col.order"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "number" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("orders.col.customer"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "customerName" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.col.status") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.col.payment") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.col.fulfillment") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("orders.col.total"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "total" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, { children: [
							t("orders.col.created"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortBtn, { col: "createdAt" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginated.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "cursor-pointer hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/orders/$id",
								params: { id: order.id },
								className: "font-medium",
								children: order.number
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/orders/$id",
								params: { id: order.id },
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground",
									children: initials(order.customerName)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: order.customerName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: order.customerEmail
								})] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: statusVariant(order.status),
								children: t(orderStatusLabelKey[order.status])
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: statusVariant(order.paymentStatus),
								children: t(paymentStatusLabelKey[order.paymentStatus])
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: statusVariant(order.fulfillmentStatus),
								children: t(fulfillmentStatusLabelKey[order.fulfillmentStatus])
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: order.currency
								}).format(order.total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm text-muted-foreground",
								children: order.createdAt
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
									align: "end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/orders/$id",
											params: { id: order.id },
											children: t("common.edit")
										})
									})
								})] })
							})
						]
					}, order.id)), paginated.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 8,
						className: "py-12 text-center text-muted-foreground",
						children: t("orders.empty")
					}) })] })] }),
					totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								t("orders.page"),
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
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
