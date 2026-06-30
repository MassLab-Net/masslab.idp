import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useI18n } from "./i18n-D_HxFyu3.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ProductForm } from "./-product-form-C5CMcXa8.mjs";
import { t as createProduct } from "./product-store-DwaJLS0o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-DvSYcKji.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	sku: "",
	category: "Software",
	status: "Draft",
	price: 0,
	currency: "USD",
	stock: 0,
	tags: [],
	translations: {
		en: {
			name: "",
			description: ""
		},
		vi: {
			name: "",
			description: ""
		}
	}
};
function NewProductPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function handleSubmit(data) {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 600));
		createProduct(data);
		setSaving(false);
		toast.success(t("products.created"));
		navigate({ to: "/admin/products" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		initial: EMPTY,
		onSubmit: handleSubmit,
		isSaving: saving,
		title: t("products.newTitle")
	});
}
//#endregion
export { NewProductPage as component };
