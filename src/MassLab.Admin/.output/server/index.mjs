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
	"/assets/-product-form-D-a2j4jx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fd-L0DYDEhf9tn2pOf+BcobpIdMVBA\"",
		"mtime": "2026-07-08T02:48:22.006Z",
		"size": 8445,
		"path": "../public/assets/-product-form-D-a2j4jx.js"
	},
	"/assets/alert-dialog-WOnrMQgl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e58-Ak54qBgTkT7pzx5S0Nm79WJpomU\"",
		"mtime": "2026-07-08T02:48:22.019Z",
		"size": 3672,
		"path": "../public/assets/alert-dialog-WOnrMQgl.js"
	},
	"/assets/auth-C1Iw7IzY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cae-8lMYsRSQxT/KwlcOf4ExP1PoEdE\"",
		"mtime": "2026-07-08T02:48:22.041Z",
		"size": 3246,
		"path": "../public/assets/auth-C1Iw7IzY.js"
	},
	"/assets/building-2-VG3ReY6h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-pYM5T3Ktkkd5t6VmbyuSn5KjTuw\"",
		"mtime": "2026-07-08T02:48:22.050Z",
		"size": 373,
		"path": "../public/assets/building-2-VG3ReY6h.js"
	},
	"/assets/checkbox-BmTnZDqk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fad-ddbJwnOVb92ZX8q8gXKUATOMyek\"",
		"mtime": "2026-07-08T02:48:22.069Z",
		"size": 4013,
		"path": "../public/assets/checkbox-BmTnZDqk.js"
	},
	"/assets/app-sidebar-BtFu_fZ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d38-K9AfDDUdk7exBAwJpsF7FSuIq+g\"",
		"mtime": "2026-07-08T02:48:22.028Z",
		"size": 27960,
		"path": "../public/assets/app-sidebar-BtFu_fZ_.js"
	},
	"/assets/arrow-left-Bx06Roqm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-z9ZXDoi19MWAoR+KIcVha0XZ5+4\"",
		"mtime": "2026-07-08T02:48:22.033Z",
		"size": 155,
		"path": "../public/assets/arrow-left-Bx06Roqm.js"
	},
	"/assets/dashboard-B5MX3_mt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"193c-O0felB3j6hbB5EY1VxRR8/pClpQ\"",
		"mtime": "2026-07-08T02:48:22.080Z",
		"size": 6460,
		"path": "../public/assets/dashboard-B5MX3_mt.js"
	},
	"/assets/card-CeFC1A2L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"439-lqXuZvDfkR8IeVRpt+MNWg/HR0Q\"",
		"mtime": "2026-07-08T02:48:22.065Z",
		"size": 1081,
		"path": "../public/assets/card-CeFC1A2L.js"
	},
	"/assets/clients-an1GjVx7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c19-8AjTSYpeXxsNpQ5qvdcQGTXQgPg\"",
		"mtime": "2026-07-08T02:48:22.074Z",
		"size": 11289,
		"path": "../public/assets/clients-an1GjVx7.js"
	},
	"/assets/button-DmhCz2Mk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7fc1-V5sIW2AlphrMaKHzpy2NvrhmiuQ\"",
		"mtime": "2026-07-08T02:48:22.060Z",
		"size": 32705,
		"path": "../public/assets/button-DmhCz2Mk.js"
	},
	"/assets/dist-BK1aWbYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dfe-P7OQVOxYugddMQD3Xq/8vdkzWec\"",
		"mtime": "2026-07-08T02:48:22.090Z",
		"size": 3582,
		"path": "../public/assets/dist-BK1aWbYL.js"
	},
	"/assets/dialog-BwzIt4Eg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86f-jn/UM24JWWP5n/HfQty4hTGE60A\"",
		"mtime": "2026-07-08T02:48:22.085Z",
		"size": 2159,
		"path": "../public/assets/dialog-BwzIt4Eg.js"
	},
	"/assets/dist-Bnma_7oL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d068-26FVdIl3m3JU6FHVlNG0EK5xN40\"",
		"mtime": "2026-07-08T02:48:22.100Z",
		"size": 53352,
		"path": "../public/assets/dist-Bnma_7oL.js"
	},
	"/assets/dist-qOHRhbD9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a9-nWZbYuNR7XqFMzdnW9Eg0/lfGWY\"",
		"mtime": "2026-07-08T02:48:22.115Z",
		"size": 4265,
		"path": "../public/assets/dist-qOHRhbD9.js"
	},
	"/assets/dist-PZR7TGGB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-iBi9IkYXQg+fEDi4wLvTq3Ho5p4\"",
		"mtime": "2026-07-08T02:48:22.110Z",
		"size": 246,
		"path": "../public/assets/dist-PZR7TGGB.js"
	},
	"/assets/dist-Bl3LZ0f2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a7-voakJyEjdbQIMwna7F9LWq3BEsE\"",
		"mtime": "2026-07-08T02:48:22.096Z",
		"size": 1447,
		"path": "../public/assets/dist-Bl3LZ0f2.js"
	},
	"/assets/docs-CkNg59Sn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fb-hCHwVRU9aGpO6u90ZbHSFWTCwC4\"",
		"mtime": "2026-07-08T02:48:22.120Z",
		"size": 6651,
		"path": "../public/assets/docs-CkNg59Sn.js"
	},
	"/assets/dropdown-menu-zidETzqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542d-9/+wT8H2hcb1Bc1A38+gGaKxgak\"",
		"mtime": "2026-07-08T02:48:22.127Z",
		"size": 21549,
		"path": "../public/assets/dropdown-menu-zidETzqa.js"
	},
	"/assets/eye-off-fRCjuNAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-WyFSpIfW6SvRN2bhLrO8PyEaq/A\"",
		"mtime": "2026-07-08T02:48:22.129Z",
		"size": 420,
		"path": "../public/assets/eye-off-fRCjuNAk.js"
	},
	"/assets/dist-KBj6NEsk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c8-W2R167uqdBydT+iP9ucFdlnn5/Q\"",
		"mtime": "2026-07-08T02:48:22.105Z",
		"size": 456,
		"path": "../public/assets/dist-KBj6NEsk.js"
	},
	"/assets/eye-D8-Mdidb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-FlKPM3+ybed96LxFML8LsBfq/mQ\"",
		"mtime": "2026-07-08T02:48:22.129Z",
		"size": 246,
		"path": "../public/assets/eye-D8-Mdidb.js"
	},
	"/assets/arrow-right-CGhLya19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-26ZfztRHEaJuRh39P/gKQo7RL8c\"",
		"mtime": "2026-07-08T02:48:22.037Z",
		"size": 155,
		"path": "../public/assets/arrow-right-CGhLya19.js"
	},
	"/assets/badge-7-Ho9b7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"321-Cp2t7CGo+qWxs4Pq2kPmJGtM32s\"",
		"mtime": "2026-07-08T02:48:22.050Z",
		"size": 801,
		"path": "../public/assets/badge-7-Ho9b7U.js"
	},
	"/assets/ellipsis-DR_Plbtk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8-9HTY5vvqGU/2Z4bd3pnj/4+5uQ0\"",
		"mtime": "2026-07-08T02:48:22.129Z",
		"size": 216,
		"path": "../public/assets/ellipsis-DR_Plbtk.js"
	},
	"/assets/flag-DD0snF45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b6-/+gQgMzanchn4Kouz2Qgrt45O24\"",
		"mtime": "2026-07-08T02:48:22.129Z",
		"size": 1206,
		"path": "../public/assets/flag-DD0snF45.js"
	},
	"/assets/globe-BMvZWZTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-+46YoiAJVzx4pM4oagCOf7EMj98\"",
		"mtime": "2026-07-08T02:48:22.146Z",
		"size": 232,
		"path": "../public/assets/globe-BMvZWZTv.js"
	},
	"/assets/identity-api-B1nx1Gho.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31d-QXfCsDNkVayVsuW70pJjheHbbVY\"",
		"mtime": "2026-07-08T02:48:22.150Z",
		"size": 797,
		"path": "../public/assets/identity-api-B1nx1Gho.js"
	},
	"/assets/jsx-runtime-o5jPw3Cc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-LpLuxQCdJgpHmoojm7lmOrrsJYM\"",
		"mtime": "2026-07-08T02:48:22.156Z",
		"size": 3907,
		"path": "../public/assets/jsx-runtime-o5jPw3Cc.js"
	},
	"/assets/key-round-J8cr9QLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-M6yfsRXNkoig/8dQQRwZvsaP7zg\"",
		"mtime": "2026-07-08T02:48:22.161Z",
		"size": 345,
		"path": "../public/assets/key-round-J8cr9QLF.js"
	},
	"/assets/link-Dnf6elyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5af9-2nt5PaA3GFl9MJgUTpJfukaUc04\"",
		"mtime": "2026-07-08T02:48:22.171Z",
		"size": 23289,
		"path": "../public/assets/link-Dnf6elyJ.js"
	},
	"/assets/label-CNMVERJ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28e-zG6Q+seea+d4TMAaxZjISxQfI20\"",
		"mtime": "2026-07-08T02:48:22.166Z",
		"size": 654,
		"path": "../public/assets/label-CNMVERJ1.js"
	},
	"/assets/loader-circle-uU63VXRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-dXANIrj44e61BOXqaOdEQeG7JVQ\"",
		"mtime": "2026-07-08T02:48:22.176Z",
		"size": 134,
		"path": "../public/assets/loader-circle-uU63VXRI.js"
	},
	"/assets/lock-BhDAibts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-jlB/CY5yssBxT/+3Yl28/xeoRdM\"",
		"mtime": "2026-07-08T02:48:22.180Z",
		"size": 196,
		"path": "../public/assets/lock-BhDAibts.js"
	},
	"/assets/input-D8884eIo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-KMrdVux+RWPMgNigwa7s5w5oqO0\"",
		"mtime": "2026-07-08T02:48:22.152Z",
		"size": 650,
		"path": "../public/assets/input-D8884eIo.js"
	},
	"/assets/index-Bz3XGq3d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"658be-U1slCGaQM68mKqhNT2QKgOAB0tw\"",
		"mtime": "2026-07-08T02:48:21.998Z",
		"size": 415934,
		"path": "../public/assets/index-Bz3XGq3d.js"
	},
	"/assets/logout-complete-CJwM1Lr_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-1c1dT1upOsUstuz/1kZp1jRVrD0\"",
		"mtime": "2026-07-08T02:48:22.195Z",
		"size": 212,
		"path": "../public/assets/logout-complete-CJwM1Lr_.js"
	},
	"/assets/logo-CwfX0Hat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15e-cFhdKwLhDBeZrD3Oe1NnRz/dMp0\"",
		"mtime": "2026-07-08T02:48:22.188Z",
		"size": 350,
		"path": "../public/assets/logo-CwfX0Hat.js"
	},
	"/assets/login-C99IiMnm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20bf-Be8IhJXdqRbIP3ZkJrI/i5MoMP8\"",
		"mtime": "2026-07-08T02:48:22.184Z",
		"size": 8383,
		"path": "../public/assets/login-C99IiMnm.js"
	},
	"/assets/MassLab_Logo_3-B-bl3OSo.png": {
		"type": "image/png",
		"etag": "\"288b7-MA7XM61fDiXeCBp157I7OOjkN+0\"",
		"mtime": "2026-07-08T02:48:22.380Z",
		"size": 166071,
		"path": "../public/assets/MassLab_Logo_3-B-bl3OSo.png"
	},
	"/assets/mail-BS81OhPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-f5wxLDHGyR6foQucOR5gzPve+Ew\"",
		"mtime": "2026-07-08T02:48:22.199Z",
		"size": 203,
		"path": "../public/assets/mail-BS81OhPs.js"
	},
	"/assets/mock-data-t_Rxtj6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c21-GSPZ0t1OombOCcZvzDFXomkZWeE\"",
		"mtime": "2026-07-08T02:48:22.204Z",
		"size": 7201,
		"path": "../public/assets/mock-data-t_Rxtj6u.js"
	},
	"/assets/new-EzM0VxSG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-34zNFc6J6AvmkW0iNkF8RDboxBg\"",
		"mtime": "2026-07-08T02:48:22.209Z",
		"size": 711,
		"path": "../public/assets/new-EzM0VxSG.js"
	},
	"/assets/orders-BLntBBZv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cf8-mPSPkWYM4L7HGFWpQHV0r8HJbf4\"",
		"mtime": "2026-07-08T02:48:22.224Z",
		"size": 11512,
		"path": "../public/assets/orders-BLntBBZv.js"
	},
	"/assets/organizations-DByEuBgn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b77-kNJJyoW1ySm+PyNDbaS/CeKccQk\"",
		"mtime": "2026-07-08T02:48:22.230Z",
		"size": 7031,
		"path": "../public/assets/organizations-DByEuBgn.js"
	},
	"/assets/MassLab_Logo_2-BeGIoRfl.png": {
		"type": "image/png",
		"etag": "\"5981a-FgP6SzancoTpaptGuKQm54DzOcg\"",
		"mtime": "2026-07-08T02:48:22.377Z",
		"size": 366618,
		"path": "../public/assets/MassLab_Logo_2-BeGIoRfl.png"
	},
	"/assets/order-store-BcPUlqqB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"217-DU2WAJzx7ff5HJI0BBeMEmELVcc\"",
		"mtime": "2026-07-08T02:48:22.218Z",
		"size": 535,
		"path": "../public/assets/order-store-BcPUlqqB.js"
	},
	"/assets/MassLab_Favicon-D1kQ6cJW.png": {
		"type": "image/png",
		"etag": "\"79e63-897pp1N0MRLUJ/J4qQ2V8S/g9M4\"",
		"mtime": "2026-07-08T02:48:22.372Z",
		"size": 499299,
		"path": "../public/assets/MassLab_Favicon-D1kQ6cJW.png"
	},
	"/assets/oidc-BBtTNj3h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1178-YAOljpJiVlt4hujK/pXbdxYHy60\"",
		"mtime": "2026-07-08T02:48:22.214Z",
		"size": 4472,
		"path": "../public/assets/oidc-BBtTNj3h.js"
	},
	"/assets/package-zBuh_lwF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a-q6pg6frt6S2mtd+JuOMyv340FTg\"",
		"mtime": "2026-07-08T02:48:22.236Z",
		"size": 362,
		"path": "../public/assets/package-zBuh_lwF.js"
	},
	"/assets/permission-tree-DMLr6wMa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21a8-eNCKHmT1Qf6kEca06LxfZGsmEFc\"",
		"mtime": "2026-07-08T02:48:22.240Z",
		"size": 8616,
		"path": "../public/assets/permission-tree-DMLr6wMa.js"
	},
	"/assets/permissions-CD6r7xLT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cae-TTgbcuCQgstyi/NQlc4Q4wJN1i0\"",
		"mtime": "2026-07-08T02:48:22.244Z",
		"size": 11438,
		"path": "../public/assets/permissions-CD6r7xLT.js"
	},
	"/assets/plus-B0TzuU2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-TZ10bQPZvLvYldPgHwDxiJttytQ\"",
		"mtime": "2026-07-08T02:48:22.247Z",
		"size": 143,
		"path": "../public/assets/plus-B0TzuU2-.js"
	},
	"/assets/popover--EHggIRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1517-U1ycXnKQMWQs2zfhUeomoqqF+3Y\"",
		"mtime": "2026-07-08T02:48:22.250Z",
		"size": 5399,
		"path": "../public/assets/popover--EHggIRA.js"
	},
	"/assets/privacy-rFGgcMHr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18aa-pH/3jskMPMH7/VRmMr2/WW55GxU\"",
		"mtime": "2026-07-08T02:48:22.253Z",
		"size": 6314,
		"path": "../public/assets/privacy-rFGgcMHr.js"
	},
	"/assets/product-store-K2DiiyGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39e-WKNehrZ+bfjyPOVrruaLk1mXORQ\"",
		"mtime": "2026-07-08T02:48:22.257Z",
		"size": 926,
		"path": "../public/assets/product-store-K2DiiyGb.js"
	},
	"/assets/products-Dd5bM-Ja.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2887-nUtDXoxuyzrwJaqswtM6JvxwETk\"",
		"mtime": "2026-07-08T02:48:22.261Z",
		"size": 10375,
		"path": "../public/assets/products-Dd5bM-Ja.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-07-08T02:48:22.268Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/redirect-BB44wZa9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-K3qCyv600LQ802/aV+Gg83W7kdk\"",
		"mtime": "2026-07-08T02:48:22.270Z",
		"size": 581,
		"path": "../public/assets/redirect-BB44wZa9.js"
	},
	"/assets/refresh-cw-L1-f0mAq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-v05VKHom4jXU6+5aRxGXknrjiLM\"",
		"mtime": "2026-07-08T02:48:22.278Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-L1-f0mAq.js"
	},
	"/assets/register-CTdHRRqA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a2c-2SQcT+OjGr9uLHzgAZ9eyYGMMfw\"",
		"mtime": "2026-07-08T02:48:22.282Z",
		"size": 10796,
		"path": "../public/assets/register-CTdHRRqA.js"
	},
	"/assets/route-CuqA35my.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e3-SazR+Ez9wqHPwFdUTlLi2Wrhyrs\"",
		"mtime": "2026-07-08T02:48:22.289Z",
		"size": 9187,
		"path": "../public/assets/route-CuqA35my.js"
	},
	"/assets/roles-BY5-9Tb-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e09-JPQYdaNa5/6Yi9idZ5Dusl/OPMw\"",
		"mtime": "2026-07-08T02:48:22.286Z",
		"size": 7689,
		"path": "../public/assets/roles-BY5-9Tb-.js"
	},
	"/assets/routes-DAzsNfFE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2403-rFNFR4N9Y0NZ3woRf/gKSI3RgHw\"",
		"mtime": "2026-07-08T02:48:22.294Z",
		"size": 9219,
		"path": "../public/assets/routes-DAzsNfFE.js"
	},
	"/assets/search-DP84Fvkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-7mMGacZUhOFQgM44/uJ3OfFEuus\"",
		"mtime": "2026-07-08T02:48:22.297Z",
		"size": 164,
		"path": "../public/assets/search-DP84Fvkq.js"
	},
	"/assets/scale-90vuZNr2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-VSVnYUgLw0HPM5zymN2RRL3+T5o\"",
		"mtime": "2026-07-08T02:48:22.297Z",
		"size": 322,
		"path": "../public/assets/scale-90vuZNr2.js"
	},
	"/assets/separator-OrAjr1TP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"316-fg2VKKDGOdazj8Bax0kVN1YHM64\"",
		"mtime": "2026-07-08T02:48:22.311Z",
		"size": 790,
		"path": "../public/assets/separator-OrAjr1TP.js"
	},
	"/assets/shield-check-q4JtIrgu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-O4KBj1UwcHzjdo20VrPZLydzZv4\"",
		"mtime": "2026-07-08T02:48:22.318Z",
		"size": 310,
		"path": "../public/assets/shield-check-q4JtIrgu.js"
	},
	"/assets/select-D0mQgsTi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54d2-i7qjfykcfzYBWK0vLs0s47ZpBl8\"",
		"mtime": "2026-07-08T02:48:22.306Z",
		"size": 21714,
		"path": "../public/assets/select-D0mQgsTi.js"
	},
	"/assets/shield-DfLyZZR-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ReGxOqYBEqxwmrUW5Cr8MLsVhDk\"",
		"mtime": "2026-07-08T02:48:22.315Z",
		"size": 262,
		"path": "../public/assets/shield-DfLyZZR-.js"
	},
	"/assets/site-footer-C_4rRXgC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1332-1b/jMtePl3Isx4NdI631GiiGO1U\"",
		"mtime": "2026-07-08T02:48:22.326Z",
		"size": 4914,
		"path": "../public/assets/site-footer-C_4rRXgC.js"
	},
	"/assets/shopping-cart-OFoyvWnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a-H9I93lp6uAIYYiQUJIeMtC5FW8Y\"",
		"mtime": "2026-07-08T02:48:22.322Z",
		"size": 282,
		"path": "../public/assets/shopping-cart-OFoyvWnD.js"
	},
	"/assets/profile-CkcH8atU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4846-fDE8laV9RjfypmC80TyP8WLRcqA\"",
		"mtime": "2026-07-08T02:48:22.265Z",
		"size": 18502,
		"path": "../public/assets/profile-CkcH8atU.js"
	},
	"/assets/sliders-horizontal-DUzFA1k_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e-59Iw+ya6NF99jPiy8CLsL7HQVHI\"",
		"mtime": "2026-07-08T02:48:22.332Z",
		"size": 606,
		"path": "../public/assets/sliders-horizontal-DUzFA1k_.js"
	},
	"/assets/status-pill-CB8dCP6Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"427-aCtHwXP4lQugovT/PDSuKms1LE0\"",
		"mtime": "2026-07-08T02:48:22.337Z",
		"size": 1063,
		"path": "../public/assets/status-pill-CB8dCP6Q.js"
	},
	"/assets/styles-BvmmDKkW.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16e2d-VzDMUcA7cvKasC2/ElmW13iU41k\"",
		"mtime": "2026-07-08T02:48:22.380Z",
		"size": 93741,
		"path": "../public/assets/styles-BvmmDKkW.css"
	},
	"/assets/table-Cax7_gyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689-fZBxop3l3DhXp182xVd3AD10TrQ\"",
		"mtime": "2026-07-08T02:48:22.340Z",
		"size": 1673,
		"path": "../public/assets/table-Cax7_gyr.js"
	},
	"/assets/textarea-nAdmiCNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"224-qW3GU4L91LGdOVnBc07qgwqoCVk\"",
		"mtime": "2026-07-08T02:48:22.350Z",
		"size": 548,
		"path": "../public/assets/textarea-nAdmiCNE.js"
	},
	"/assets/tabs-DaEs2hm9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d67-5yOHpkd0p9ldnoGErwS+cHMtp4Y\"",
		"mtime": "2026-07-08T02:48:22.345Z",
		"size": 3431,
		"path": "../public/assets/tabs-DaEs2hm9.js"
	},
	"/assets/terms-Dhbsr02D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a95-AFIJIQXVWI3v68bXrNlc/+hPa5M\"",
		"mtime": "2026-07-08T02:48:22.347Z",
		"size": 6805,
		"path": "../public/assets/terms-Dhbsr02D.js"
	},
	"/assets/users-BV7jij3l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c06-rvsEq6ZKEhWGeKbkXnitPJ/vtj0\"",
		"mtime": "2026-07-08T02:48:22.354Z",
		"size": 11270,
		"path": "../public/assets/users-BV7jij3l.js"
	},
	"/assets/users-sVPDNsy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-C3Sw/Rg6gLsjzFm8Yb9ROrCWa9o\"",
		"mtime": "2026-07-08T02:48:22.358Z",
		"size": 296,
		"path": "../public/assets/users-sVPDNsy5.js"
	},
	"/assets/x-CJiJ5FWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ucm2DLWHui95gxOjm/x+FQ3N7uQ\"",
		"mtime": "2026-07-08T02:48:22.363Z",
		"size": 144,
		"path": "../public/assets/x-CJiJ5FWm.js"
	},
	"/assets/_id-BSLN8O2H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2546-5nMtdumokOW05XHLQwSt5dHgSOE\"",
		"mtime": "2026-07-08T02:48:22.011Z",
		"size": 9542,
		"path": "../public/assets/_id-BSLN8O2H.js"
	},
	"/assets/_id.edit-VN6btGMG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"539-017AcEIKuH/80ZVb0es/vGU8anY\"",
		"mtime": "2026-07-08T02:48:22.013Z",
		"size": 1337,
		"path": "../public/assets/_id.edit-VN6btGMG.js"
	},
	"/assets/zap-B4ObUm5r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf-XdqASmq0hjP5ymDHC+F9FiMGZRE\"",
		"mtime": "2026-07-08T02:48:22.368Z",
		"size": 463,
		"path": "../public/assets/zap-B4ObUm5r.js"
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
