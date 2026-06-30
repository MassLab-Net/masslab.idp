import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flag-gbFpOcqo.js
var import_jsx_runtime = require_jsx_runtime();
function FlagEN({ className = "h-4 w-5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 30",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
				id: "t",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 0v30h60V0z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
				id: "s",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M30 15h30v15zV15H0v15zH0V0h30zV0h30z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				clipPath: "url(#t)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 0v30h60V0z",
						fill: "#012169"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 0l60 30m0-30L0 30",
						stroke: "#fff",
						strokeWidth: "6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 0l60 30m0-30L0 30",
						clipPath: "url(#s)",
						stroke: "#C8102E",
						strokeWidth: "4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M30 0v30M0 15h60",
						stroke: "#fff",
						strokeWidth: "10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M30 0v30M0 15h60",
						stroke: "#C8102E",
						strokeWidth: "6"
					})
				]
			})
		]
	});
}
function FlagVI({ className = "h-4 w-5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 30 20",
		className,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "30",
			height: "20",
			fill: "#DA251D"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			fill: "#FF0",
			points: "15,4 16.7,9.2 22.1,9.2 17.7,12.4 19.4,17.6 15,14.4 10.6,17.6 12.3,12.4 7.9,9.2 13.3,9.2"
		})]
	});
}
function Flag({ lang, className }) {
	return lang === "vi" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagVI, { className }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagEN, { className });
}
//#endregion
export { Flag as t };
