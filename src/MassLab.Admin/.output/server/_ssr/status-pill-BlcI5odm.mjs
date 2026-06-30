import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-BPK1zgJN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-BlcI5odm.js
var import_jsx_runtime = require_jsx_runtime();
function statusVariant(s) {
	const v = s.toLowerCase();
	if (v === "active") return "success";
	if (v === "invited" || v === "pending") return "info";
	if (v === "suspended" || v === "disabled") return "danger";
	if (v === "starter") return "neutral";
	if (v === "business") return "info";
	if (v === "enterprise") return "success";
	return "neutral";
}
function StatusPill({ variant = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", variant === "success" && "border-success/30 bg-success/10 text-success", variant === "info" && "border-primary/30 bg-primary/10 text-primary", variant === "warning" && "border-warning/40 bg-warning/15 text-foreground", variant === "danger" && "border-destructive/30 bg-destructive/10 text-destructive", variant === "neutral" && "border-border bg-muted text-muted-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", variant === "success" && "bg-success", variant === "info" && "bg-primary", variant === "warning" && "bg-warning", variant === "danger" && "bg-destructive", variant === "neutral" && "bg-muted-foreground/50") }), children]
	});
}
//#endregion
export { statusVariant as n, StatusPill as t };
