import { n as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./_ssr/i18n-D_HxFyu3.mjs";
import { P as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Route } from "./_id.edit-BJ-shdPy.mjs";
import { t as ProductForm } from "./_ssr/-product-form-C5CMcXa8.mjs";
import { a as getProductTitle, o as updateProduct, r as getProductById } from "./_ssr/product-store-DwaJLS0o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id.edit-D3HC6r5T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditProductPage() {
	const { t, lang } = useI18n();
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const product = getProductById(id);
	const initial = (0, import_react.useMemo)(() => product ? {
		sku: product.sku,
		category: product.category,
		status: product.status,
		price: product.price,
		currency: product.currency,
		stock: product.stock,
		tags: [...product.tags],
		translations: {
			en: {
				name: product.translations.en.name,
				description: product.translations.en.description
			},
			vi: {
				name: product.translations.vi.name,
				description: product.translations.vi.description
			}
		}
	} : null, [product]);
	if (!product || !initial) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-4xl font-bold text-gradient-brand",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-semibold",
				children: t("products.notFound")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("products.notFoundDesc")
			})
		]
	});
	async function handleSubmit(_data) {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 600));
		updateProduct(id, _data);
		setSaving(false);
		toast.success(t("products.updated"));
		navigate({ to: "/admin/products" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		initial,
		onSubmit: handleSubmit,
		isSaving: saving,
		title: `${t("products.editTitle")}: ${getProductTitle(product, lang)}`
	});
}
//#endregion
export { EditProductPage as component };
