globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/-product-form-BoRWg1J6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d18-R62uW6sbgvH+ZbS5HXfuvloI3S0\"",
		"mtime": "2026-06-30T13:26:14.259Z",
		"size": 11544,
		"path": "../public/assets/-product-form-BoRWg1J6.js"
	},
	"/assets/_id-5run7URz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2521-8DJffYpkKaqtecNgySlNu4JDNJI\"",
		"mtime": "2026-06-30T13:26:14.259Z",
		"size": 9505,
		"path": "../public/assets/_id-5run7URz.js"
	},
	"/assets/_id.edit-pUGPfLtG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"511-jxDvYbl9MlwyGO4XA7gyt9zCqp8\"",
		"mtime": "2026-06-30T13:26:14.259Z",
		"size": 1297,
		"path": "../public/assets/_id.edit-pUGPfLtG.js"
	},
	"/assets/alert-dialog-YOYucfED.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e14-y2mHFEaRCq8ZITIFcbHacv8aRbs\"",
		"mtime": "2026-06-30T13:26:14.260Z",
		"size": 3604,
		"path": "../public/assets/alert-dialog-YOYucfED.js"
	},
	"/assets/app-sidebar-BnFbll3l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bd5-m9uPsxwoUwMUTARrFguAty711/0\"",
		"mtime": "2026-06-30T13:26:14.260Z",
		"size": 27605,
		"path": "../public/assets/app-sidebar-BnFbll3l.js"
	},
	"/assets/arrow-left-B8JSijEi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-KgSmKpO/6Gaw9MZf/ERtV+GVJj8\"",
		"mtime": "2026-06-30T13:26:14.260Z",
		"size": 153,
		"path": "../public/assets/arrow-left-B8JSijEi.js"
	},
	"/assets/auth-Bq56HmQ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2268-O91a40j040iDPyfRAXCiqv84HM0\"",
		"mtime": "2026-06-30T13:26:14.260Z",
		"size": 8808,
		"path": "../public/assets/auth-Bq56HmQ9.js"
	},
	"/assets/badge-HF5OuNW-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"301-kl/k9tPsfL6CDxQw00NKqHhiYnA\"",
		"mtime": "2026-06-30T13:26:14.261Z",
		"size": 769,
		"path": "../public/assets/badge-HF5OuNW-.js"
	},
	"/assets/building-2-JW7fAwg2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"173-6K83t2i/TU3R1eUNS1iF/wO01jE\"",
		"mtime": "2026-06-30T13:26:14.261Z",
		"size": 371,
		"path": "../public/assets/building-2-JW7fAwg2.js"
	},
	"/assets/MassLab_Logo_3-B-bl3OSo.png": {
		"type": "image/png",
		"etag": "\"288b7-MA7XM61fDiXeCBp157I7OOjkN+0\"",
		"mtime": "2026-06-30T13:26:14.302Z",
		"size": 166071,
		"path": "../public/assets/MassLab_Logo_3-B-bl3OSo.png"
	},
	"/assets/card-HAud_cHM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"414-n4i8Uo+KjxdDTo5RElBLjXrNfjk\"",
		"mtime": "2026-06-30T13:26:14.261Z",
		"size": 1044,
		"path": "../public/assets/card-HAud_cHM.js"
	},
	"/assets/checkbox-BVkPLlhD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f68-grAspLjvdhTNSa75ekNYH0Nbkq0\"",
		"mtime": "2026-06-30T13:26:14.261Z",
		"size": 3944,
		"path": "../public/assets/checkbox-BVkPLlhD.js"
	},
	"/assets/dashboard-BXDrrU9G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1903-5sHlxDruSgYXfD+9u7xpgHRMCbA\"",
		"mtime": "2026-06-30T13:26:14.261Z",
		"size": 6403,
		"path": "../public/assets/dashboard-BXDrrU9G.js"
	},
	"/assets/MassLab_Favicon-D1kQ6cJW.png": {
		"type": "image/png",
		"etag": "\"79e63-897pp1N0MRLUJ/J4qQ2V8S/g9M4\"",
		"mtime": "2026-06-30T13:26:14.301Z",
		"size": 499299,
		"path": "../public/assets/MassLab_Favicon-D1kQ6cJW.png"
	},
	"/assets/dialog-BQes2U-g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"84b-DMUW53pf+RbAwjbW2FyByAIYW3Y\"",
		"mtime": "2026-06-30T13:26:14.262Z",
		"size": 2123,
		"path": "../public/assets/dialog-BQes2U-g.js"
	},
	"/assets/MassLab_Logo_2-BeGIoRfl.png": {
		"type": "image/png",
		"etag": "\"5981a-FgP6SzancoTpaptGuKQm54DzOcg\"",
		"mtime": "2026-06-30T13:26:14.302Z",
		"size": 366618,
		"path": "../public/assets/MassLab_Logo_2-BeGIoRfl.png"
	},
	"/assets/dist-48Eg2b3s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1505f-Jp1/et3Jkxi1jsbyJ1UoVbJtSTM\"",
		"mtime": "2026-06-30T13:26:14.262Z",
		"size": 86111,
		"path": "../public/assets/dist-48Eg2b3s.js"
	},
	"/assets/dist-B5zYKC9y2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1064-h7d5ype4M6K6eRTr3T1Bywr8vjY\"",
		"mtime": "2026-06-30T13:26:14.263Z",
		"size": 4196,
		"path": "../public/assets/dist-B5zYKC9y2.js"
	},
	"/assets/dist-CnzJNkrt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"562-GI6sdrBZQUqcA26RyWFU3I7r94M\"",
		"mtime": "2026-06-30T13:26:14.263Z",
		"size": 1378,
		"path": "../public/assets/dist-CnzJNkrt.js"
	},
	"/assets/dist-DP2OkUhQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-m3dQAQtCMAimWLBwgoxjElBuOsc\"",
		"mtime": "2026-06-30T13:26:14.263Z",
		"size": 250,
		"path": "../public/assets/dist-DP2OkUhQ.js"
	},
	"/assets/dist-DYlRG1Uy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5-8CpYweMh1odeCSdxzCxSqt79JB0\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 421,
		"path": "../public/assets/dist-DYlRG1Uy.js"
	},
	"/assets/dist-RSDtpwxE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db9-JWLbxa/nMN3+HaOuSDCbFI+cYAk\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 3513,
		"path": "../public/assets/dist-RSDtpwxE.js"
	},
	"/assets/docs-CZe8-6yw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19cf-yA2MNXKkXF2H0NdgZTMJtQUXOoo\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 6607,
		"path": "../public/assets/docs-CZe8-6yw.js"
	},
	"/assets/dropdown-menu-CuVvkHuz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53da-EVMJF2mtmtVLkGP/OCzw2J9MVaY\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 21466,
		"path": "../public/assets/dropdown-menu-CuVvkHuz.js"
	},
	"/assets/ellipsis-B8trOHsI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d6-kkVqwBP44EJL3p1FVu8/gPHX7Ig\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 214,
		"path": "../public/assets/ellipsis-B8trOHsI.js"
	},
	"/assets/eye-8LFrjGnT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-h2wtQg5yb3BZR+bJKWLtHhOyKBY\"",
		"mtime": "2026-06-30T13:26:14.264Z",
		"size": 244,
		"path": "../public/assets/eye-8LFrjGnT.js"
	},
	"/assets/flag-0fJPJO_X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-KpPguydAAsBQPKEZFFodaLAZXv0\"",
		"mtime": "2026-06-30T13:26:14.265Z",
		"size": 1199,
		"path": "../public/assets/flag-0fJPJO_X.js"
	},
	"/assets/eye-off-CCBLDC5y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-KEGsGuYwMdFB+PSHoYJFVR93yKA\"",
		"mtime": "2026-06-30T13:26:14.265Z",
		"size": 418,
		"path": "../public/assets/eye-off-CCBLDC5y.js"
	},
	"/assets/globe-Bp5FVkl0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-fhEelTlPTnjKa3wGPtI4Gb9YVRQ\"",
		"mtime": "2026-06-30T13:26:14.265Z",
		"size": 230,
		"path": "../public/assets/globe-Bp5FVkl0.js"
	},
	"/assets/identity-api-yjjjxV8m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e-yI3o0fbyl71rYmCjUQIbieVs/Ak\"",
		"mtime": "2026-06-30T13:26:14.265Z",
		"size": 574,
		"path": "../public/assets/identity-api-yjjjxV8m.js"
	},
	"/assets/i18n-rI36gV6k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113ea-Q4C8cTYpyWA60JkdgJyw+oK1Ar0\"",
		"mtime": "2026-06-30T13:26:14.265Z",
		"size": 70634,
		"path": "../public/assets/i18n-rI36gV6k.js"
	},
	"/assets/input-NOsxFO8P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"265-GnRLpx/6GgXuw25ye8hJCo7HDNo\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 613,
		"path": "../public/assets/input-NOsxFO8P.js"
	},
	"/assets/label-B1EQg3Y2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"249-Enduy7raduAC12c4RJVdC4H9jwc\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 585,
		"path": "../public/assets/label-B1EQg3Y2.js"
	},
	"/assets/link-CYGZeQs3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5acc-AjwTEfQPIBA/C1EQG6bqApRi2W0\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 23244,
		"path": "../public/assets/link-CYGZeQs3.js"
	},
	"/assets/loader-circle-D63xwPvU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"84-QwmihHs8viV3tdmb3q2FlhAcndE\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 132,
		"path": "../public/assets/loader-circle-D63xwPvU.js"
	},
	"/assets/lock-C0lsEUZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-nwr0sEOUB3q3q1uusHJxDID5Pa0\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 194,
		"path": "../public/assets/lock-C0lsEUZW.js"
	},
	"/assets/logo-BcjDJcBQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"157-WVxrZTuWby7ab/3nAWsk2HIADUc\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 343,
		"path": "../public/assets/logo-BcjDJcBQ.js"
	},
	"/assets/key-round-GuNgOX4L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"157-s803xJYKQCqIL+L4arjxayZAb2A\"",
		"mtime": "2026-06-30T13:26:14.266Z",
		"size": 343,
		"path": "../public/assets/key-round-GuNgOX4L.js"
	},
	"/assets/mail-C1i55HQn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c9-Fa7t8+oxsD8mqfOYkuRdR2wKr6M\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 201,
		"path": "../public/assets/mail-C1i55HQn.js"
	},
	"/assets/mock-data-t_Rxtj6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c21-GSPZ0t1OombOCcZvzDFXomkZWeE\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 7201,
		"path": "../public/assets/mock-data-t_Rxtj6u.js"
	},
	"/assets/new-B8RlvWD7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29f-7g46PP5PEHCXsHxaULZSlpuU8pY\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 671,
		"path": "../public/assets/new-B8RlvWD7.js"
	},
	"/assets/oidc-BoLHNJ99.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e46-SZKp0eZ4aPAu0H1BBqcAZ1tmUH0\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 3654,
		"path": "../public/assets/oidc-BoLHNJ99.js"
	},
	"/assets/order-store-wCkMUita.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21b-6dBKe+CRe9G6AWI7GJaLTuKkaDg\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 539,
		"path": "../public/assets/order-store-wCkMUita.js"
	},
	"/assets/orders-CUyC7xq2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cd8-ubboRa7MMwtuJ+DuX7M0RSA6cfE\"",
		"mtime": "2026-06-30T13:26:14.267Z",
		"size": 11480,
		"path": "../public/assets/orders-CUyC7xq2.js"
	},
	"/assets/organizations-ise9qokh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19d3-zdV/AkTmT2x/Syse5F52dgwz8Qo\"",
		"mtime": "2026-06-30T13:26:14.268Z",
		"size": 6611,
		"path": "../public/assets/organizations-ise9qokh.js"
	},
	"/assets/package-Z2AHg2Kc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"168-K60A32nwgD12g0IUSyKBot7OLhI\"",
		"mtime": "2026-06-30T13:26:14.268Z",
		"size": 360,
		"path": "../public/assets/package-Z2AHg2Kc.js"
	},
	"/assets/permissions-zrrUdu6i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20f3-O3iNy3/OcpiacBOwWK4BK66KHC8\"",
		"mtime": "2026-06-30T13:26:14.268Z",
		"size": 8435,
		"path": "../public/assets/permissions-zrrUdu6i.js"
	},
	"/assets/plus-BD0IFIxg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-GkXkfA8b0qvKvfZrvEtSm2Udl6s\"",
		"mtime": "2026-06-30T13:26:14.268Z",
		"size": 141,
		"path": "../public/assets/plus-BD0IFIxg.js"
	},
	"/assets/popover-CD6yNAvQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14d2-tGQ5XDdIgNMzIohlM5vQNBeNaT4\"",
		"mtime": "2026-06-30T13:26:14.268Z",
		"size": 5330,
		"path": "../public/assets/popover-CD6yNAvQ.js"
	},
	"/assets/index-Bk6cGjF5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55e85-m7laY7L0K8K+pYQeaWWJSlH12u0\"",
		"mtime": "2026-06-30T13:26:14.259Z",
		"size": 351877,
		"path": "../public/assets/index-Bk6cGjF5.js"
	},
	"/assets/privacy-Bltz3eHQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187e-YgOM9ZZiCyQWtbXTa7cCbryWcXQ\"",
		"mtime": "2026-06-30T13:26:14.269Z",
		"size": 6270,
		"path": "../public/assets/privacy-Bltz3eHQ.js"
	},
	"/assets/product-store-CrCTmPa-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a2-MdHrC6fdapLH+biV4EIKRI3QpdQ\"",
		"mtime": "2026-06-30T13:26:14.269Z",
		"size": 930,
		"path": "../public/assets/product-store-CrCTmPa-.js"
	},
	"/assets/products-BDR2Wwvy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2862-Jar0hQqyHwP+c08vBUqcz7wU2Rw\"",
		"mtime": "2026-06-30T13:26:14.269Z",
		"size": 10338,
		"path": "../public/assets/products-BDR2Wwvy.js"
	},
	"/assets/profile-BJ1l1qdv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4806-eji8vzhZyRl35smVtkyj6KTuqJI\"",
		"mtime": "2026-06-30T13:26:14.269Z",
		"size": 18438,
		"path": "../public/assets/profile-BJ1l1qdv.js"
	},
	"/assets/refresh-cw-DW1qiFGF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-cw9DoXzllPuGSwYHnjkcC8VMi60\"",
		"mtime": "2026-06-30T13:26:14.270Z",
		"size": 309,
		"path": "../public/assets/refresh-cw-DW1qiFGF.js"
	},
	"/assets/redirect-BB44wZa9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-K3qCyv600LQ802/aV+Gg83W7kdk\"",
		"mtime": "2026-06-30T13:26:14.270Z",
		"size": 581,
		"path": "../public/assets/redirect-BB44wZa9.js"
	},
	"/assets/register-C-OM71G9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a06-QxfIqcLnSXag6a+ZFPIRmYrUytg\"",
		"mtime": "2026-06-30T13:26:14.275Z",
		"size": 10758,
		"path": "../public/assets/register-C-OM71G9.js"
	},
	"/assets/roles-BoQoftCV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4b-H5+QKNI1U8zt9kIYk7q9VjtBaIw\"",
		"mtime": "2026-06-30T13:26:14.281Z",
		"size": 7243,
		"path": "../public/assets/roles-BoQoftCV.js"
	},
	"/assets/route-BGjO--wX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20a1-+j/3Z24M3FZxloV+w+3UTHQInew\"",
		"mtime": "2026-06-30T13:26:14.281Z",
		"size": 8353,
		"path": "../public/assets/route-BGjO--wX.js"
	},
	"/assets/routes-D0CLJrRe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2471-2feKZxrSqcAOBvuVYNEdGEyqrig\"",
		"mtime": "2026-06-30T13:26:14.296Z",
		"size": 9329,
		"path": "../public/assets/routes-D0CLJrRe.js"
	},
	"/assets/scale-DJERsuAW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-JGKn+0miLMTFnq/IA0LZn+ryW7g\"",
		"mtime": "2026-06-30T13:26:14.297Z",
		"size": 320,
		"path": "../public/assets/scale-DJERsuAW.js"
	},
	"/assets/search-sA7l8Dn7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-IPG56Omf79XOTo0VajZyNvXkfa8\"",
		"mtime": "2026-06-30T13:26:14.298Z",
		"size": 162,
		"path": "../public/assets/search-sA7l8Dn7.js"
	},
	"/assets/select-95joDxIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5489-mn6L/IlTlCXfhO74HDr5ww1z7SM\"",
		"mtime": "2026-06-30T13:26:14.298Z",
		"size": 21641,
		"path": "../public/assets/select-95joDxIr.js"
	},
	"/assets/separator-UhKk-EFH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d1-usXo6if0G23szDnSWUyp6EbVxxc\"",
		"mtime": "2026-06-30T13:26:14.298Z",
		"size": 721,
		"path": "../public/assets/separator-UhKk-EFH.js"
	},
	"/assets/shield-SkAFBH7F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"104-hPhIZtFx/Q++ByMvl1veDIaM2uQ\"",
		"mtime": "2026-06-30T13:26:14.299Z",
		"size": 260,
		"path": "../public/assets/shield-SkAFBH7F.js"
	},
	"/assets/shield-check-DZ8EboJS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-qVtFmegirw08Jkd95InuCyaimms\"",
		"mtime": "2026-06-30T13:26:14.299Z",
		"size": 308,
		"path": "../public/assets/shield-check-DZ8EboJS.js"
	},
	"/assets/shopping-cart-DRTvKcwl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-qaV6eqHXUxmm6+8c0AV4+gB1lJI\"",
		"mtime": "2026-06-30T13:26:14.299Z",
		"size": 280,
		"path": "../public/assets/shopping-cart-DRTvKcwl.js"
	},
	"/assets/site-footer-Bhf8xSZl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1316-2fst87hTI8COUy2oIxQnG+vpSfM\"",
		"mtime": "2026-06-30T13:26:14.299Z",
		"size": 4886,
		"path": "../public/assets/site-footer-Bhf8xSZl.js"
	},
	"/assets/sliders-horizontal-7VaXGbBt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25c-Pcq2/D88pLJCSotzgA2lM7AzJKU\"",
		"mtime": "2026-06-30T13:26:14.300Z",
		"size": 604,
		"path": "../public/assets/sliders-horizontal-7VaXGbBt.js"
	},
	"/assets/status-pill-DGhwH7Ov.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41e-LK4p43/AnPpAnUiRBgFZbPRdyTU\"",
		"mtime": "2026-06-30T13:26:14.300Z",
		"size": 1054,
		"path": "../public/assets/status-pill-DGhwH7Ov.js"
	},
	"/assets/table-BDVSBzu8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"664-uvDQCeZHe6xkF7WoTvmTEqRU6NA\"",
		"mtime": "2026-06-30T13:26:14.300Z",
		"size": 1636,
		"path": "../public/assets/table-BDVSBzu8.js"
	},
	"/assets/terms-DAUXL5UK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a69-J6LMCqx25IizY0MG0KlEs4lf5fA\"",
		"mtime": "2026-06-30T13:26:14.300Z",
		"size": 6761,
		"path": "../public/assets/terms-DAUXL5UK.js"
	},
	"/assets/textarea-CXxp4huz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ff-mEcO9Q65MzsTJpe6K2gnZH63VXk\"",
		"mtime": "2026-06-30T13:26:14.300Z",
		"size": 511,
		"path": "../public/assets/textarea-CXxp4huz.js"
	},
	"/assets/users-BDJ7fT8z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f03-wetbEr+lS2r1VJTocL9VWqkwSP8\"",
		"mtime": "2026-06-30T13:26:14.301Z",
		"size": 7939,
		"path": "../public/assets/users-BDJ7fT8z.js"
	},
	"/assets/styles-ZHN5Lpvq.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1696a-aSv0uGpL0g2XINY0S2VhjnFEaXc\"",
		"mtime": "2026-06-30T13:26:14.302Z",
		"size": 92522,
		"path": "../public/assets/styles-ZHN5Lpvq.css"
	},
	"/assets/users-BWpqcydD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-wrl6vhYiS66Z6ROy70GUD5XIL1w\"",
		"mtime": "2026-06-30T13:26:14.301Z",
		"size": 294,
		"path": "../public/assets/users-BWpqcydD.js"
	},
	"/assets/x-7EBZGpXf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-OAodnJPE5Sp45lzNg0jVeu3/xtw\"",
		"mtime": "2026-06-30T13:26:14.301Z",
		"size": 142,
		"path": "../public/assets/x-7EBZGpXf.js"
	},
	"/assets/zap-CvuVxfSm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cd-b4B08+IdVbfrg37511dZ/rkYtjM\"",
		"mtime": "2026-06-30T13:26:14.301Z",
		"size": 461,
		"path": "../public/assets/zap-CvuVxfSm.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_cShVEn = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_cShVEn
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
