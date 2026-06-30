import { n as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./_ssr/i18n-D_HxFyu3.mjs";
import { P as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./_ssr/organizations-DNmoE0r-.mjs";
import { t as Route } from "./_id-BA7kSB0j.mjs";
import { t as Button } from "./_ssr/button-BPK1zgJN.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-C886EF0p.mjs";
import { t as Input } from "./_ssr/input-BYcV5Phs.mjs";
import { t as Label } from "./_ssr/label-uIHy1f1H.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DdpCoWi7.mjs";
import { t as Textarea } from "./_ssr/textarea-CxCjlOsm.mjs";
import { t as Separator } from "./_ssr/separator-DDlQh6CO.mjs";
import { t as StatusPill } from "./_ssr/status-pill-BlcI5odm.mjs";
import { X as ArrowLeft, u as ShoppingCart } from "./_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C9T31-X3.mjs";
import { n as updateOrder, t as getOrderById } from "./_ssr/order-store-JUgtU0IN.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-ER3NSOxk.js
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
function OrderDetailPage() {
	const { t } = useI18n();
	const { id } = Route.useParams();
	useNavigate();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const order = getOrderById(id);
	const draft = (0, import_react.useMemo)(() => {
		if (!order) return null;
		return {
			number: order.number,
			customerName: order.customerName,
			customerEmail: order.customerEmail,
			organization: order.organization,
			status: order.status,
			paymentStatus: order.paymentStatus,
			fulfillmentStatus: order.fulfillmentStatus,
			currency: order.currency,
			items: order.items,
			subtotal: order.subtotal,
			shipping: order.shipping,
			tax: order.tax,
			total: order.total,
			notes: order.notes
		};
	}, [order]);
	const [form, setForm] = (0, import_react.useState)(draft);
	(0, import_react.useEffect)(() => {
		setForm(draft);
	}, [draft]);
	if (!order || !form) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-4xl font-bold text-gradient-brand",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-semibold",
				children: t("orders.notFound")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("orders.notFoundDesc")
			})
		]
	});
	function set(key, value) {
		setForm((current) => current ? {
			...current,
			[key]: value
		} : current);
	}
	async function saveChanges() {
		if (!form) return;
		setSaving(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		updateOrder(id, form);
		setSaving(false);
		toast.success(t("orders.updated"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `${t("orders.detailTitle")} ${order.number}`,
				subtitle: t("orders.detailSubtitle"),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-4 w-4" }),
								" ",
								t("common.cancel")
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: saveChanges,
						disabled: saving,
						className: "bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95",
						children: saving ? t("products.saving") : t("common.save")
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: t("orders.status.label"),
						value: t(orderStatusLabelKey[order.status]),
						variant: statusVariant(order.status)
					},
					{
						label: t("orders.payment.label"),
						value: t(paymentStatusLabelKey[order.paymentStatus]),
						variant: statusVariant(order.paymentStatus)
					},
					{
						label: t("orders.fulfillment.label"),
						value: t(fulfillmentStatusLabelKey[order.fulfillmentStatus]),
						variant: statusVariant(order.fulfillmentStatus)
					},
					{
						label: t("orders.col.total"),
						value: new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: order.currency
						}).format(order.total),
						variant: "neutral"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								variant: item.variant,
								children: item.value
							})
						})]
					})
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: t("orders.sectionCustomer")
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.customerName") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.customerName,
										onChange: (e) => set("customerName", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.customerEmail") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.customerEmail,
										onChange: (e) => set("customerEmail", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.organization") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.organization,
										onChange: (e) => set("organization", e.target.value)
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-primary" }),
								" ",
								t("orders.sectionItems")
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.item.product") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.item.qty") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.item.price") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: t("orders.item.total") })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: form.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-xs text-muted-foreground",
									children: item.productId
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: item.qty }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: form.currency
								}).format(item.price) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: form.currency
								}).format(item.qty * item.price) })
							] }, item.productId)) })] })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("orders.sectionStatus")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.status.label") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.status,
											onValueChange: (v) => set("status", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.payment.label") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.paymentStatus,
											onValueChange: (v) => set("paymentStatus", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("orders.fulfillment.label") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.fulfillmentStatus,
											onValueChange: (v) => set("fulfillmentStatus", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("orders.sectionSummary")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("orders.subtotal")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: form.currency
											}).format(form.subtotal)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("orders.shipping")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: form.currency
											}).format(form.shipping)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("orders.tax")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: form.currency
											}).format(form.tax)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-base font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("orders.total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: form.currency
										}).format(form.total) })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: t("orders.sectionNotes")
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 5,
								value: form.notes,
								onChange: (e) => set("notes", e.target.value)
							}) })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { OrderDetailPage as component };
