import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as PRODUCTS } from "./mock-data-C6f75jgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-store-DwaJLS0o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var productState = [...PRODUCTS];
var listeners = /* @__PURE__ */ new Set();
function emit() {
	listeners.forEach((listener) => listener());
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function useProducts() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => productState, () => productState);
}
function getProductById(id) {
	return productState.find((product) => product.id === id);
}
function deleteProduct(id) {
	const next = productState.filter((product) => product.id !== id);
	if (next.length === productState.length) return false;
	productState = next;
	emit();
	return true;
}
function upsertProduct(product) {
	productState = productState.some((item) => item.id === product.id) ? productState.map((item) => item.id === product.id ? product : item) : [product, ...productState];
	emit();
}
function createProduct(draft) {
	const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const product = {
		id: `prd_${Date.now()}`,
		createdAt: now,
		updatedAt: now,
		...draft
	};
	upsertProduct(product);
	return product;
}
function updateProduct(id, draft) {
	const existing = getProductById(id);
	if (!existing) return null;
	const product = {
		...existing,
		...draft,
		id,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	};
	upsertProduct(product);
	return product;
}
function getProductTitle(product, lang) {
	return product.translations[lang]?.name || product.translations.en.name;
}
function getProductDescription(product, lang) {
	return product.translations[lang]?.description || product.translations.en.description;
}
//#endregion
export { getProductTitle as a, getProductDescription as i, deleteProduct as n, updateProduct as o, getProductById as r, useProducts as s, createProduct as t };
