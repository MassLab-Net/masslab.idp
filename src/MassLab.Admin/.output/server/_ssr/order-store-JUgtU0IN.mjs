import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as ORDERS } from "./mock-data-C6f75jgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-store-JUgtU0IN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var orderState = [...ORDERS];
var listeners = /* @__PURE__ */ new Set();
function emit() {
	listeners.forEach((listener) => listener());
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function useOrders() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => orderState, () => orderState);
}
function getOrderById(id) {
	return orderState.find((order) => order.id === id);
}
function upsertOrder(order) {
	orderState = orderState.some((item) => item.id === order.id) ? orderState.map((item) => item.id === order.id ? order : item) : [order, ...orderState];
	emit();
}
function updateOrder(id, draft) {
	const existing = getOrderById(id);
	if (!existing) return null;
	const order = {
		...existing,
		...draft,
		id,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	};
	upsertOrder(order);
	return order;
}
//#endregion
export { updateOrder as n, useOrders as r, getOrderById as t };
