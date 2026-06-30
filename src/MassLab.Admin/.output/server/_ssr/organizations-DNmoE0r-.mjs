import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/organizations-DNmoE0r-.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./organizations-D-o24TSc.mjs");
var Route = createFileRoute("/admin/tenant/organizations")({
	head: () => ({ meta: [{ title: "Organizations — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight md:text-3xl",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: subtitle
		})] }), action]
	});
}
//#endregion
export { Route as n, PageHeader as t };
