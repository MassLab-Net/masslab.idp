import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-CGem-MrE.js
var import_jsx_runtime = require_jsx_runtime();
var MassLab_Logo_2_default = "/assets/MassLab_Logo_2-BeGIoRfl.png";
var MassLab_Logo_3_default = "/assets/MassLab_Logo_3-B-bl3OSo.png";
function Logo({ size = 40, showWord = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: showWord ? MassLab_Logo_2_default : MassLab_Logo_3_default,
			alt: "MassLab",
			style: {
				height: size,
				width: "auto"
			},
			className: "select-none"
		})
	});
}
//#endregion
export { Logo as t };
