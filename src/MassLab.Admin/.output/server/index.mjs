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
	"/assets/-product-form-CKuqgTkw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fd-5PEjAp+au7dQAWFv4/V7OyiCm54\"",
		"mtime": "2026-07-21T08:37:04.896Z",
		"size": 8445,
		"path": "../public/assets/-product-form-CKuqgTkw.js"
	},
	"/assets/access-denied-Cz-RQojR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48c-8RrTwVhagyoNqKOqmhPX5ExzmCU\"",
		"mtime": "2026-07-21T08:37:04.906Z",
		"size": 1164,
		"path": "../public/assets/access-denied-Cz-RQojR.js"
	},
	"/assets/arrow-left-Bx06Roqm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-z9ZXDoi19MWAoR+KIcVha0XZ5+4\"",
		"mtime": "2026-07-21T08:37:04.914Z",
		"size": 155,
		"path": "../public/assets/arrow-left-Bx06Roqm.js"
	},
	"/assets/alert-dialog-WOnrMQgl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e58-Ak54qBgTkT7pzx5S0Nm79WJpomU\"",
		"mtime": "2026-07-21T08:37:04.908Z",
		"size": 3672,
		"path": "../public/assets/alert-dialog-WOnrMQgl.js"
	},
	"/assets/auth-B-tuzX9l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d19-gq5mfN3OQOH5t/TnZCrGqidiyXU\"",
		"mtime": "2026-07-21T08:37:04.916Z",
		"size": 3353,
		"path": "../public/assets/auth-B-tuzX9l.js"
	},
	"/assets/arrow-right-CGhLya19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-26ZfztRHEaJuRh39P/gKQo7RL8c\"",
		"mtime": "2026-07-21T08:37:04.916Z",
		"size": 155,
		"path": "../public/assets/arrow-right-CGhLya19.js"
	},
	"/assets/app-sidebar-BGrsqe8p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ffa-eoBqPiAvBezPACJzG6IAWGZ7abE\"",
		"mtime": "2026-07-21T08:37:04.910Z",
		"size": 28666,
		"path": "../public/assets/app-sidebar-BGrsqe8p.js"
	},
	"/assets/badge-7-Ho9b7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"321-Cp2t7CGo+qWxs4Pq2kPmJGtM32s\"",
		"mtime": "2026-07-21T08:37:04.920Z",
		"size": 801,
		"path": "../public/assets/badge-7-Ho9b7U.js"
	},
	"/assets/card-CeFC1A2L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"439-lqXuZvDfkR8IeVRpt+MNWg/HR0Q\"",
		"mtime": "2026-07-21T08:37:04.928Z",
		"size": 1081,
		"path": "../public/assets/card-CeFC1A2L.js"
	},
	"/assets/building-2-VG3ReY6h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-pYM5T3Ktkkd5t6VmbyuSn5KjTuw\"",
		"mtime": "2026-07-21T08:37:04.924Z",
		"size": 373,
		"path": "../public/assets/building-2-VG3ReY6h.js"
	},
	"/assets/button-DmhCz2Mk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7fc1-V5sIW2AlphrMaKHzpy2NvrhmiuQ\"",
		"mtime": "2026-07-21T08:37:04.926Z",
		"size": 32705,
		"path": "../public/assets/button-DmhCz2Mk.js"
	},
	"/assets/copy-E3zEaNsa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2-hov5xCE86w8w1ib5xjBg83Dp7Cc\"",
		"mtime": "2026-07-21T08:37:04.934Z",
		"size": 226,
		"path": "../public/assets/copy-E3zEaNsa.js"
	},
	"/assets/clients-CUlN0KyY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c19-m7MxF3a+sJ9vSTfFJfmkbGDYY9k\"",
		"mtime": "2026-07-21T08:37:04.932Z",
		"size": 11289,
		"path": "../public/assets/clients-CUlN0KyY.js"
	},
	"/assets/checkbox-BmTnZDqk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fad-ddbJwnOVb92ZX8q8gXKUATOMyek\"",
		"mtime": "2026-07-21T08:37:04.930Z",
		"size": 4013,
		"path": "../public/assets/checkbox-BmTnZDqk.js"
	},
	"/assets/dialog-BwzIt4Eg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86f-jn/UM24JWWP5n/HfQty4hTGE60A\"",
		"mtime": "2026-07-21T08:37:04.938Z",
		"size": 2159,
		"path": "../public/assets/dialog-BwzIt4Eg.js"
	},
	"/assets/dashboard-fsMVwwTm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aac-AVvPeudHrtcQ2DMQ394foK+0CHs\"",
		"mtime": "2026-07-21T08:37:04.936Z",
		"size": 6828,
		"path": "../public/assets/dashboard-fsMVwwTm.js"
	},
	"/assets/dist-BK1aWbYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dfe-P7OQVOxYugddMQD3Xq/8vdkzWec\"",
		"mtime": "2026-07-21T08:37:04.940Z",
		"size": 3582,
		"path": "../public/assets/dist-BK1aWbYL.js"
	},
	"/assets/dist-Bl3LZ0f2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a7-voakJyEjdbQIMwna7F9LWq3BEsE\"",
		"mtime": "2026-07-21T08:37:04.942Z",
		"size": 1447,
		"path": "../public/assets/dist-Bl3LZ0f2.js"
	},
	"/assets/dist-Bnma_7oL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d068-26FVdIl3m3JU6FHVlNG0EK5xN40\"",
		"mtime": "2026-07-21T08:37:04.944Z",
		"size": 53352,
		"path": "../public/assets/dist-Bnma_7oL.js"
	},
	"/assets/dist-KBj6NEsk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c8-W2R167uqdBydT+iP9ucFdlnn5/Q\"",
		"mtime": "2026-07-21T08:37:04.944Z",
		"size": 456,
		"path": "../public/assets/dist-KBj6NEsk.js"
	},
	"/assets/docs-DyBZEWOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fb-+UFvBTz5BxlyXVc55XoOPCnuYmk\"",
		"mtime": "2026-07-21T08:37:04.950Z",
		"size": 6651,
		"path": "../public/assets/docs-DyBZEWOo.js"
	},
	"/assets/dist-qOHRhbD9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a9-nWZbYuNR7XqFMzdnW9Eg0/lfGWY\"",
		"mtime": "2026-07-21T08:37:04.948Z",
		"size": 4265,
		"path": "../public/assets/dist-qOHRhbD9.js"
	},
	"/assets/dist-PZR7TGGB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-iBi9IkYXQg+fEDi4wLvTq3Ho5p4\"",
		"mtime": "2026-07-21T08:37:04.946Z",
		"size": 246,
		"path": "../public/assets/dist-PZR7TGGB.js"
	},
	"/assets/dropdown-menu-zidETzqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542d-9/+wT8H2hcb1Bc1A38+gGaKxgak\"",
		"mtime": "2026-07-21T08:37:04.952Z",
		"size": 21549,
		"path": "../public/assets/dropdown-menu-zidETzqa.js"
	},
	"/assets/ellipsis-DR_Plbtk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8-9HTY5vvqGU/2Z4bd3pnj/4+5uQ0\"",
		"mtime": "2026-07-21T08:37:04.954Z",
		"size": 216,
		"path": "../public/assets/ellipsis-DR_Plbtk.js"
	},
	"/assets/flag-DD0snF45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b6-/+gQgMzanchn4Kouz2Qgrt45O24\"",
		"mtime": "2026-07-21T08:37:04.960Z",
		"size": 1206,
		"path": "../public/assets/flag-DD0snF45.js"
	},
	"/assets/eye-D8-Mdidb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-FlKPM3+ybed96LxFML8LsBfq/mQ\"",
		"mtime": "2026-07-21T08:37:04.956Z",
		"size": 246,
		"path": "../public/assets/eye-D8-Mdidb.js"
	},
	"/assets/eye-off-fRCjuNAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-WyFSpIfW6SvRN2bhLrO8PyEaq/A\"",
		"mtime": "2026-07-21T08:37:04.958Z",
		"size": 420,
		"path": "../public/assets/eye-off-fRCjuNAk.js"
	},
	"/assets/globe-BMvZWZTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-+46YoiAJVzx4pM4oagCOf7EMj98\"",
		"mtime": "2026-07-21T08:37:04.971Z",
		"size": 232,
		"path": "../public/assets/globe-BMvZWZTv.js"
	},
	"/assets/identity-api-gltEq0MX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"307-+vfujqEkY6DhtCZx9kXQLt0pWW0\"",
		"mtime": "2026-07-21T08:37:04.975Z",
		"size": 775,
		"path": "../public/assets/identity-api-gltEq0MX.js"
	},
	"/assets/index-uYrecJz-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65de7-DyySEsplKF8a8LvEJtlgAhFmpKk\"",
		"mtime": "2026-07-21T08:37:04.892Z",
		"size": 417255,
		"path": "../public/assets/index-uYrecJz-.js"
	},
	"/assets/input-D8884eIo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-KMrdVux+RWPMgNigwa7s5w5oqO0\"",
		"mtime": "2026-07-21T08:37:04.977Z",
		"size": 650,
		"path": "../public/assets/input-D8884eIo.js"
	},
	"/assets/jsx-runtime-o5jPw3Cc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-LpLuxQCdJgpHmoojm7lmOrrsJYM\"",
		"mtime": "2026-07-21T08:37:04.981Z",
		"size": 3907,
		"path": "../public/assets/jsx-runtime-o5jPw3Cc.js"
	},
	"/assets/link-Dnf6elyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5af9-2nt5PaA3GFl9MJgUTpJfukaUc04\"",
		"mtime": "2026-07-21T08:37:04.989Z",
		"size": 23289,
		"path": "../public/assets/link-Dnf6elyJ.js"
	},
	"/assets/key-round-J8cr9QLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-M6yfsRXNkoig/8dQQRwZvsaP7zg\"",
		"mtime": "2026-07-21T08:37:04.985Z",
		"size": 345,
		"path": "../public/assets/key-round-J8cr9QLF.js"
	},
	"/assets/loader-circle-uU63VXRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-dXANIrj44e61BOXqaOdEQeG7JVQ\"",
		"mtime": "2026-07-21T08:37:04.993Z",
		"size": 134,
		"path": "../public/assets/loader-circle-uU63VXRI.js"
	},
	"/assets/label-CNMVERJ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28e-zG6Q+seea+d4TMAaxZjISxQfI20\"",
		"mtime": "2026-07-21T08:37:04.987Z",
		"size": 654,
		"path": "../public/assets/label-CNMVERJ1.js"
	},
	"/assets/login-sIG18r37.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fcf-EjmQi9UKvfkkNFhBarJIBYkzomA\"",
		"mtime": "2026-07-21T08:37:04.999Z",
		"size": 8143,
		"path": "../public/assets/login-sIG18r37.js"
	},
	"/assets/logo-CwfX0Hat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15e-cFhdKwLhDBeZrD3Oe1NnRz/dMp0\"",
		"mtime": "2026-07-21T08:37:05.001Z",
		"size": 350,
		"path": "../public/assets/logo-CwfX0Hat.js"
	},
	"/assets/mail-BS81OhPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-f5wxLDHGyR6foQucOR5gzPve+Ew\"",
		"mtime": "2026-07-21T08:37:05.007Z",
		"size": 203,
		"path": "../public/assets/mail-BS81OhPs.js"
	},
	"/assets/lock-BhDAibts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-jlB/CY5yssBxT/+3Yl28/xeoRdM\"",
		"mtime": "2026-07-21T08:37:04.997Z",
		"size": 196,
		"path": "../public/assets/lock-BhDAibts.js"
	},
	"/assets/logout-complete-BnTqL2Qk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-83SfPKP1Lxcv2/ApswHIwfr0u1E\"",
		"mtime": "2026-07-21T08:37:05.003Z",
		"size": 212,
		"path": "../public/assets/logout-complete-BnTqL2Qk.js"
	},
	"/assets/MassLab_Favicon-D1kQ6cJW.png": {
		"type": "image/png",
		"etag": "\"79e63-897pp1N0MRLUJ/J4qQ2V8S/g9M4\"",
		"mtime": "2026-07-21T08:37:05.136Z",
		"size": 499299,
		"path": "../public/assets/MassLab_Favicon-D1kQ6cJW.png"
	},
	"/assets/mock-data-t_Rxtj6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c21-GSPZ0t1OombOCcZvzDFXomkZWeE\"",
		"mtime": "2026-07-21T08:37:05.010Z",
		"size": 7201,
		"path": "../public/assets/mock-data-t_Rxtj6u.js"
	},
	"/assets/MassLab_Logo_2-BeGIoRfl.png": {
		"type": "image/png",
		"etag": "\"5981a-FgP6SzancoTpaptGuKQm54DzOcg\"",
		"mtime": "2026-07-21T08:37:05.138Z",
		"size": 366618,
		"path": "../public/assets/MassLab_Logo_2-BeGIoRfl.png"
	},
	"/assets/MassLab_Logo_3-B-bl3OSo.png": {
		"type": "image/png",
		"etag": "\"288b7-MA7XM61fDiXeCBp157I7OOjkN+0\"",
		"mtime": "2026-07-21T08:37:05.140Z",
		"size": 166071,
		"path": "../public/assets/MassLab_Logo_3-B-bl3OSo.png"
	},
	"/assets/new-BIEmKIqL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-Wk79SOS0jBPJWcbQqdb4iPUoZWE\"",
		"mtime": "2026-07-21T08:37:05.013Z",
		"size": 711,
		"path": "../public/assets/new-BIEmKIqL.js"
	},
	"/assets/oidc-BKoLDAv9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10ef-Vvrbpiv/pAvvCbEP+oti+jBeVkk\"",
		"mtime": "2026-07-21T08:37:05.015Z",
		"size": 4335,
		"path": "../public/assets/oidc-BKoLDAv9.js"
	},
	"/assets/order-store-BcPUlqqB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"217-DU2WAJzx7ff5HJI0BBeMEmELVcc\"",
		"mtime": "2026-07-21T08:37:05.020Z",
		"size": 535,
		"path": "../public/assets/order-store-BcPUlqqB.js"
	},
	"/assets/orders-HWmGLgPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cf8-lpYDosLenDzrOWyZN9bWhgBktbQ\"",
		"mtime": "2026-07-21T08:37:05.022Z",
		"size": 11512,
		"path": "../public/assets/orders-HWmGLgPb.js"
	},
	"/assets/package-zBuh_lwF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a-q6pg6frt6S2mtd+JuOMyv340FTg\"",
		"mtime": "2026-07-21T08:37:05.026Z",
		"size": 362,
		"path": "../public/assets/package-zBuh_lwF.js"
	},
	"/assets/permission-tree-DMLr6wMa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21a8-eNCKHmT1Qf6kEca06LxfZGsmEFc\"",
		"mtime": "2026-07-21T08:37:05.029Z",
		"size": 8616,
		"path": "../public/assets/permission-tree-DMLr6wMa.js"
	},
	"/assets/permissions-DmkmUOf6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2dc6-vigy3HvtboqsvHRS71+nf41N0wA\"",
		"mtime": "2026-07-21T08:37:05.032Z",
		"size": 11718,
		"path": "../public/assets/permissions-DmkmUOf6.js"
	},
	"/assets/organizations-COdRAAm9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3095-8Fc1iEKOCd9CZAva9TVzh7OmUmA\"",
		"mtime": "2026-07-21T08:37:05.024Z",
		"size": 12437,
		"path": "../public/assets/organizations-COdRAAm9.js"
	},
	"/assets/popover--EHggIRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1517-U1ycXnKQMWQs2zfhUeomoqqF+3Y\"",
		"mtime": "2026-07-21T08:37:05.036Z",
		"size": 5399,
		"path": "../public/assets/popover--EHggIRA.js"
	},
	"/assets/plus-B0TzuU2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-TZ10bQPZvLvYldPgHwDxiJttytQ\"",
		"mtime": "2026-07-21T08:37:05.034Z",
		"size": 143,
		"path": "../public/assets/plus-B0TzuU2-.js"
	},
	"/assets/privacy-AemoSa1K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18aa-ud9ZZnxaNYL/lgqyzjrDRVR91/o\"",
		"mtime": "2026-07-21T08:37:05.038Z",
		"size": 6314,
		"path": "../public/assets/privacy-AemoSa1K.js"
	},
	"/assets/product-store-K2DiiyGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39e-WKNehrZ+bfjyPOVrruaLk1mXORQ\"",
		"mtime": "2026-07-21T08:37:05.042Z",
		"size": 926,
		"path": "../public/assets/product-store-K2DiiyGb.js"
	},
	"/assets/products-B_Hp4JR3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2887-mF9f3QrDHeb0ifnbOyIWuOtN2qY\"",
		"mtime": "2026-07-21T08:37:05.045Z",
		"size": 10375,
		"path": "../public/assets/products-B_Hp4JR3.js"
	},
	"/assets/profile-mYGqu0Vl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b77c-9flIAAAxc2WZhG83vtxVIn9Cnvo\"",
		"mtime": "2026-07-21T08:37:05.049Z",
		"size": 46972,
		"path": "../public/assets/profile-mYGqu0Vl.js"
	},
	"/assets/redirect-BB44wZa9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-K3qCyv600LQ802/aV+Gg83W7kdk\"",
		"mtime": "2026-07-21T08:37:05.057Z",
		"size": 581,
		"path": "../public/assets/redirect-BB44wZa9.js"
	},
	"/assets/roles-D6feiukr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e41-2aRNj1oJsU6/3S7t4if92xmRIm8\"",
		"mtime": "2026-07-21T08:37:05.071Z",
		"size": 7745,
		"path": "../public/assets/roles-D6feiukr.js"
	},
	"/assets/refresh-cw-L1-f0mAq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-v05VKHom4jXU6+5aRxGXknrjiLM\"",
		"mtime": "2026-07-21T08:37:05.063Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-L1-f0mAq.js"
	},
	"/assets/register-PBMAbaR2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a4c-MYJQeL927en7xqs5Cs4xU0PWXEA\"",
		"mtime": "2026-07-21T08:37:05.067Z",
		"size": 10828,
		"path": "../public/assets/register-PBMAbaR2.js"
	},
	"/assets/select-D0mQgsTi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54d2-i7qjfykcfzYBWK0vLs0s47ZpBl8\"",
		"mtime": "2026-07-21T08:37:05.089Z",
		"size": 21714,
		"path": "../public/assets/select-D0mQgsTi.js"
	},
	"/assets/route-BiBiYZBO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f3-bzWjhRd4qXYIrkXLzkWsYqGtTVM\"",
		"mtime": "2026-07-21T08:37:05.075Z",
		"size": 9459,
		"path": "../public/assets/route-BiBiYZBO.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-07-21T08:37:05.053Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/search-DP84Fvkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-7mMGacZUhOFQgM44/uJ3OfFEuus\"",
		"mtime": "2026-07-21T08:37:05.085Z",
		"size": 164,
		"path": "../public/assets/search-DP84Fvkq.js"
	},
	"/assets/shield-check-q4JtIrgu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-O4KBj1UwcHzjdo20VrPZLydzZv4\"",
		"mtime": "2026-07-21T08:37:05.099Z",
		"size": 310,
		"path": "../public/assets/shield-check-q4JtIrgu.js"
	},
	"/assets/separator-OrAjr1TP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"316-fg2VKKDGOdazj8Bax0kVN1YHM64\"",
		"mtime": "2026-07-21T08:37:05.093Z",
		"size": 790,
		"path": "../public/assets/separator-OrAjr1TP.js"
	},
	"/assets/shield-DfLyZZR-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ReGxOqYBEqxwmrUW5Cr8MLsVhDk\"",
		"mtime": "2026-07-21T08:37:05.095Z",
		"size": 262,
		"path": "../public/assets/shield-DfLyZZR-.js"
	},
	"/assets/routes-Bl8m42Wh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245f-EqCFdfaSZOB3LFKXvq/RjDnnDHc\"",
		"mtime": "2026-07-21T08:37:05.079Z",
		"size": 9311,
		"path": "../public/assets/routes-Bl8m42Wh.js"
	},
	"/assets/scale-90vuZNr2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-VSVnYUgLw0HPM5zymN2RRL3+T5o\"",
		"mtime": "2026-07-21T08:37:05.081Z",
		"size": 322,
		"path": "../public/assets/scale-90vuZNr2.js"
	},
	"/assets/shopping-cart-OFoyvWnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a-H9I93lp6uAIYYiQUJIeMtC5FW8Y\"",
		"mtime": "2026-07-21T08:37:05.103Z",
		"size": 282,
		"path": "../public/assets/shopping-cart-OFoyvWnD.js"
	},
	"/assets/site-footer-CkBFW2UH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138e-dZrYCgcZqC5stZHUo1pVN2Agr8M\"",
		"mtime": "2026-07-21T08:37:05.107Z",
		"size": 5006,
		"path": "../public/assets/site-footer-CkBFW2UH.js"
	},
	"/assets/status-pill-CB8dCP6Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"427-aCtHwXP4lQugovT/PDSuKms1LE0\"",
		"mtime": "2026-07-21T08:37:05.114Z",
		"size": 1063,
		"path": "../public/assets/status-pill-CB8dCP6Q.js"
	},
	"/assets/table-Cax7_gyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689-fZBxop3l3DhXp182xVd3AD10TrQ\"",
		"mtime": "2026-07-21T08:37:05.116Z",
		"size": 1673,
		"path": "../public/assets/table-Cax7_gyr.js"
	},
	"/assets/sliders-horizontal-DUzFA1k_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e-59Iw+ya6NF99jPiy8CLsL7HQVHI\"",
		"mtime": "2026-07-21T08:37:05.112Z",
		"size": 606,
		"path": "../public/assets/sliders-horizontal-DUzFA1k_.js"
	},
	"/assets/tabs-DaEs2hm9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d67-5yOHpkd0p9ldnoGErwS+cHMtp4Y\"",
		"mtime": "2026-07-21T08:37:05.118Z",
		"size": 3431,
		"path": "../public/assets/tabs-DaEs2hm9.js"
	},
	"/assets/styles-CBVrL1Np.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17483-k2dy+MYt/IoHiL/lsSz2jECS1bI\"",
		"mtime": "2026-07-21T08:37:05.144Z",
		"size": 95363,
		"path": "../public/assets/styles-CBVrL1Np.css"
	},
	"/assets/textarea-nAdmiCNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"224-qW3GU4L91LGdOVnBc07qgwqoCVk\"",
		"mtime": "2026-07-21T08:37:05.124Z",
		"size": 548,
		"path": "../public/assets/textarea-nAdmiCNE.js"
	},
	"/assets/users-BLVMIjdH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7c-9DRW59EppJ4qe/COkXYQIMjdaLI\"",
		"mtime": "2026-07-21T08:37:05.126Z",
		"size": 11388,
		"path": "../public/assets/users-BLVMIjdH.js"
	},
	"/assets/users-sVPDNsy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-C3Sw/Rg6gLsjzFm8Yb9ROrCWa9o\"",
		"mtime": "2026-07-21T08:37:05.128Z",
		"size": 296,
		"path": "../public/assets/users-sVPDNsy5.js"
	},
	"/assets/terms-BsfOo0E2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a95-CFfkvsmGKWP/G7rG+LQWLfP16l8\"",
		"mtime": "2026-07-21T08:37:05.120Z",
		"size": 6805,
		"path": "../public/assets/terms-BsfOo0E2.js"
	},
	"/assets/x-CJiJ5FWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ucm2DLWHui95gxOjm/x+FQ3N7uQ\"",
		"mtime": "2026-07-21T08:37:05.130Z",
		"size": 144,
		"path": "../public/assets/x-CJiJ5FWm.js"
	},
	"/assets/zap-B4ObUm5r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf-XdqASmq0hjP5ymDHC+F9FiMGZRE\"",
		"mtime": "2026-07-21T08:37:05.134Z",
		"size": 463,
		"path": "../public/assets/zap-B4ObUm5r.js"
	},
	"/assets/_id.edit-CAQrUQh3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"539-lCv8I9QmRx1kvUxl3CYbKa9SXDY\"",
		"mtime": "2026-07-21T08:37:04.902Z",
		"size": 1337,
		"path": "../public/assets/_id.edit-CAQrUQh3.js"
	},
	"/assets/_id-DaagQnTa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2546-xbvyR/dmE3S/zYobHdavR7CmkGk\"",
		"mtime": "2026-07-21T08:37:04.898Z",
		"size": 9542,
		"path": "../public/assets/_id-DaagQnTa.js"
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
var _lazy_v7bQOA = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_v7bQOA
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
