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
	"/assets/alert-dialog-WOnrMQgl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e58-Ak54qBgTkT7pzx5S0Nm79WJpomU\"",
		"mtime": "2026-07-08T03:02:39.200Z",
		"size": 3672,
		"path": "../public/assets/alert-dialog-WOnrMQgl.js"
	},
	"/assets/app-sidebar-BLdHQjN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d38-GpmPUHcGZew1mMiHF4Cb1YopmQs\"",
		"mtime": "2026-07-08T03:02:39.207Z",
		"size": 27960,
		"path": "../public/assets/app-sidebar-BLdHQjN2.js"
	},
	"/assets/-product-form-DqaM4CS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fd-1spALtVTuWwwPrZ7auBFRuMO0dE\"",
		"mtime": "2026-07-08T03:02:39.191Z",
		"size": 8445,
		"path": "../public/assets/-product-form-DqaM4CS-.js"
	},
	"/assets/arrow-right-CGhLya19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-26ZfztRHEaJuRh39P/gKQo7RL8c\"",
		"mtime": "2026-07-08T03:02:39.217Z",
		"size": 155,
		"path": "../public/assets/arrow-right-CGhLya19.js"
	},
	"/assets/badge-7-Ho9b7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"321-Cp2t7CGo+qWxs4Pq2kPmJGtM32s\"",
		"mtime": "2026-07-08T03:02:39.223Z",
		"size": 801,
		"path": "../public/assets/badge-7-Ho9b7U.js"
	},
	"/assets/arrow-left-Bx06Roqm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-z9ZXDoi19MWAoR+KIcVha0XZ5+4\"",
		"mtime": "2026-07-08T03:02:39.213Z",
		"size": 155,
		"path": "../public/assets/arrow-left-Bx06Roqm.js"
	},
	"/assets/auth-BvB6s0oH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ceb-tUZiVg9526DYZNdVbeEKNslK00s\"",
		"mtime": "2026-07-08T03:02:39.217Z",
		"size": 3307,
		"path": "../public/assets/auth-BvB6s0oH.js"
	},
	"/assets/button-DmhCz2Mk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7fc1-V5sIW2AlphrMaKHzpy2NvrhmiuQ\"",
		"mtime": "2026-07-08T03:02:39.230Z",
		"size": 32705,
		"path": "../public/assets/button-DmhCz2Mk.js"
	},
	"/assets/dashboard-BhDAPejm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"193c-eSJKIEx2jEq001oSqirG3jk/IDI\"",
		"mtime": "2026-07-08T03:02:39.247Z",
		"size": 6460,
		"path": "../public/assets/dashboard-BhDAPejm.js"
	},
	"/assets/clients-BJvJEGt3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c19-oHHSeMbuobatYIq5VgpN4rhSpxQ\"",
		"mtime": "2026-07-08T03:02:39.240Z",
		"size": 11289,
		"path": "../public/assets/clients-BJvJEGt3.js"
	},
	"/assets/default-tenant-BF9gZoPK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c-lRjiZwXvovu69zHe2L2IC7IYSsk\"",
		"mtime": "2026-07-08T03:02:39.253Z",
		"size": 28,
		"path": "../public/assets/default-tenant-BF9gZoPK.js"
	},
	"/assets/checkbox-BmTnZDqk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fad-ddbJwnOVb92ZX8q8gXKUATOMyek\"",
		"mtime": "2026-07-08T03:02:39.238Z",
		"size": 4013,
		"path": "../public/assets/checkbox-BmTnZDqk.js"
	},
	"/assets/building-2-VG3ReY6h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-pYM5T3Ktkkd5t6VmbyuSn5KjTuw\"",
		"mtime": "2026-07-08T03:02:39.227Z",
		"size": 373,
		"path": "../public/assets/building-2-VG3ReY6h.js"
	},
	"/assets/dist-BK1aWbYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dfe-P7OQVOxYugddMQD3Xq/8vdkzWec\"",
		"mtime": "2026-07-08T03:02:39.259Z",
		"size": 3582,
		"path": "../public/assets/dist-BK1aWbYL.js"
	},
	"/assets/dist-Bl3LZ0f2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a7-voakJyEjdbQIMwna7F9LWq3BEsE\"",
		"mtime": "2026-07-08T03:02:39.265Z",
		"size": 1447,
		"path": "../public/assets/dist-Bl3LZ0f2.js"
	},
	"/assets/card-CeFC1A2L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"439-lqXuZvDfkR8IeVRpt+MNWg/HR0Q\"",
		"mtime": "2026-07-08T03:02:39.236Z",
		"size": 1081,
		"path": "../public/assets/card-CeFC1A2L.js"
	},
	"/assets/dist-Bnma_7oL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d068-26FVdIl3m3JU6FHVlNG0EK5xN40\"",
		"mtime": "2026-07-08T03:02:39.269Z",
		"size": 53352,
		"path": "../public/assets/dist-Bnma_7oL.js"
	},
	"/assets/dist-KBj6NEsk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c8-W2R167uqdBydT+iP9ucFdlnn5/Q\"",
		"mtime": "2026-07-08T03:02:39.269Z",
		"size": 456,
		"path": "../public/assets/dist-KBj6NEsk.js"
	},
	"/assets/dist-PZR7TGGB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-iBi9IkYXQg+fEDi4wLvTq3Ho5p4\"",
		"mtime": "2026-07-08T03:02:39.274Z",
		"size": 246,
		"path": "../public/assets/dist-PZR7TGGB.js"
	},
	"/assets/dialog-BwzIt4Eg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86f-jn/UM24JWWP5n/HfQty4hTGE60A\"",
		"mtime": "2026-07-08T03:02:39.257Z",
		"size": 2159,
		"path": "../public/assets/dialog-BwzIt4Eg.js"
	},
	"/assets/dist-qOHRhbD9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a9-nWZbYuNR7XqFMzdnW9Eg0/lfGWY\"",
		"mtime": "2026-07-08T03:02:39.279Z",
		"size": 4265,
		"path": "../public/assets/dist-qOHRhbD9.js"
	},
	"/assets/dropdown-menu-zidETzqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542d-9/+wT8H2hcb1Bc1A38+gGaKxgak\"",
		"mtime": "2026-07-08T03:02:39.279Z",
		"size": 21549,
		"path": "../public/assets/dropdown-menu-zidETzqa.js"
	},
	"/assets/ellipsis-DR_Plbtk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8-9HTY5vvqGU/2Z4bd3pnj/4+5uQ0\"",
		"mtime": "2026-07-08T03:02:39.293Z",
		"size": 216,
		"path": "../public/assets/ellipsis-DR_Plbtk.js"
	},
	"/assets/eye-D8-Mdidb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-FlKPM3+ybed96LxFML8LsBfq/mQ\"",
		"mtime": "2026-07-08T03:02:39.294Z",
		"size": 246,
		"path": "../public/assets/eye-D8-Mdidb.js"
	},
	"/assets/docs-CcCAhdUZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fb-xSZQmk/YFl0CiyNZPFlMn2Pzx/I\"",
		"mtime": "2026-07-08T03:02:39.279Z",
		"size": 6651,
		"path": "../public/assets/docs-CcCAhdUZ.js"
	},
	"/assets/eye-off-fRCjuNAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-WyFSpIfW6SvRN2bhLrO8PyEaq/A\"",
		"mtime": "2026-07-08T03:02:39.301Z",
		"size": 420,
		"path": "../public/assets/eye-off-fRCjuNAk.js"
	},
	"/assets/flag-DD0snF45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b6-/+gQgMzanchn4Kouz2Qgrt45O24\"",
		"mtime": "2026-07-08T03:02:39.305Z",
		"size": 1206,
		"path": "../public/assets/flag-DD0snF45.js"
	},
	"/assets/globe-BMvZWZTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-+46YoiAJVzx4pM4oagCOf7EMj98\"",
		"mtime": "2026-07-08T03:02:39.307Z",
		"size": 232,
		"path": "../public/assets/globe-BMvZWZTv.js"
	},
	"/assets/input-D8884eIo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-KMrdVux+RWPMgNigwa7s5w5oqO0\"",
		"mtime": "2026-07-08T03:02:39.315Z",
		"size": 650,
		"path": "../public/assets/input-D8884eIo.js"
	},
	"/assets/identity-api-B1nx1Gho.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31d-QXfCsDNkVayVsuW70pJjheHbbVY\"",
		"mtime": "2026-07-08T03:02:39.310Z",
		"size": 797,
		"path": "../public/assets/identity-api-B1nx1Gho.js"
	},
	"/assets/index-2RB8Qq7q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"658fa-bWmewk4AkNjrLuLYqDFfR284Iz0\"",
		"mtime": "2026-07-08T03:02:39.186Z",
		"size": 415994,
		"path": "../public/assets/index-2RB8Qq7q.js"
	},
	"/assets/jsx-runtime-o5jPw3Cc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-LpLuxQCdJgpHmoojm7lmOrrsJYM\"",
		"mtime": "2026-07-08T03:02:39.317Z",
		"size": 3907,
		"path": "../public/assets/jsx-runtime-o5jPw3Cc.js"
	},
	"/assets/key-round-J8cr9QLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-M6yfsRXNkoig/8dQQRwZvsaP7zg\"",
		"mtime": "2026-07-08T03:02:39.321Z",
		"size": 345,
		"path": "../public/assets/key-round-J8cr9QLF.js"
	},
	"/assets/label-CNMVERJ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28e-zG6Q+seea+d4TMAaxZjISxQfI20\"",
		"mtime": "2026-07-08T03:02:39.324Z",
		"size": 654,
		"path": "../public/assets/label-CNMVERJ1.js"
	},
	"/assets/link-Dnf6elyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5af9-2nt5PaA3GFl9MJgUTpJfukaUc04\"",
		"mtime": "2026-07-08T03:02:39.330Z",
		"size": 23289,
		"path": "../public/assets/link-Dnf6elyJ.js"
	},
	"/assets/loader-circle-uU63VXRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-dXANIrj44e61BOXqaOdEQeG7JVQ\"",
		"mtime": "2026-07-08T03:02:39.334Z",
		"size": 134,
		"path": "../public/assets/loader-circle-uU63VXRI.js"
	},
	"/assets/lock-BhDAibts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-jlB/CY5yssBxT/+3Yl28/xeoRdM\"",
		"mtime": "2026-07-08T03:02:39.338Z",
		"size": 196,
		"path": "../public/assets/lock-BhDAibts.js"
	},
	"/assets/logout-complete-DUKDqO07.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-qi2HT3nAWe5AqrqyL9bSpMdhv2I\"",
		"mtime": "2026-07-08T03:02:39.348Z",
		"size": 212,
		"path": "../public/assets/logout-complete-DUKDqO07.js"
	},
	"/assets/mail-BS81OhPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-f5wxLDHGyR6foQucOR5gzPve+Ew\"",
		"mtime": "2026-07-08T03:02:39.348Z",
		"size": 203,
		"path": "../public/assets/mail-BS81OhPs.js"
	},
	"/assets/login-Saz6NI3C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2149-ykJXlssl/W7Nq2mB9M0fj2iv9u0\"",
		"mtime": "2026-07-08T03:02:39.342Z",
		"size": 8521,
		"path": "../public/assets/login-Saz6NI3C.js"
	},
	"/assets/mock-data-t_Rxtj6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c21-GSPZ0t1OombOCcZvzDFXomkZWeE\"",
		"mtime": "2026-07-08T03:02:39.356Z",
		"size": 7201,
		"path": "../public/assets/mock-data-t_Rxtj6u.js"
	},
	"/assets/logo-CwfX0Hat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15e-cFhdKwLhDBeZrD3Oe1NnRz/dMp0\"",
		"mtime": "2026-07-08T03:02:39.344Z",
		"size": 350,
		"path": "../public/assets/logo-CwfX0Hat.js"
	},
	"/assets/new-DkJH2Xpd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-5qqy0+p4tP/7zSd1NYVF8xTVrz8\"",
		"mtime": "2026-07-08T03:02:39.360Z",
		"size": 711,
		"path": "../public/assets/new-DkJH2Xpd.js"
	},
	"/assets/oidc-BBtTNj3h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1178-YAOljpJiVlt4hujK/pXbdxYHy60\"",
		"mtime": "2026-07-08T03:02:39.364Z",
		"size": 4472,
		"path": "../public/assets/oidc-BBtTNj3h.js"
	},
	"/assets/order-store-BcPUlqqB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"217-DU2WAJzx7ff5HJI0BBeMEmELVcc\"",
		"mtime": "2026-07-08T03:02:39.368Z",
		"size": 535,
		"path": "../public/assets/order-store-BcPUlqqB.js"
	},
	"/assets/MassLab_Logo_3-B-bl3OSo.png": {
		"type": "image/png",
		"etag": "\"288b7-MA7XM61fDiXeCBp157I7OOjkN+0\"",
		"mtime": "2026-07-08T03:02:39.601Z",
		"size": 166071,
		"path": "../public/assets/MassLab_Logo_3-B-bl3OSo.png"
	},
	"/assets/orders-CjuYtQZC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cf8-757vN0uU0+o439UhJ1dx2NzoAe4\"",
		"mtime": "2026-07-08T03:02:39.387Z",
		"size": 11512,
		"path": "../public/assets/orders-CjuYtQZC.js"
	},
	"/assets/MassLab_Logo_2-BeGIoRfl.png": {
		"type": "image/png",
		"etag": "\"5981a-FgP6SzancoTpaptGuKQm54DzOcg\"",
		"mtime": "2026-07-08T03:02:39.595Z",
		"size": 366618,
		"path": "../public/assets/MassLab_Logo_2-BeGIoRfl.png"
	},
	"/assets/MassLab_Favicon-D1kQ6cJW.png": {
		"type": "image/png",
		"etag": "\"79e63-897pp1N0MRLUJ/J4qQ2V8S/g9M4\"",
		"mtime": "2026-07-08T03:02:39.591Z",
		"size": 499299,
		"path": "../public/assets/MassLab_Favicon-D1kQ6cJW.png"
	},
	"/assets/organizations-C-zc2bkx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b77-iqPt7ofwzX12fvuuo16vGPLO3YA\"",
		"mtime": "2026-07-08T03:02:39.401Z",
		"size": 7031,
		"path": "../public/assets/organizations-C-zc2bkx.js"
	},
	"/assets/permission-tree-DMLr6wMa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21a8-eNCKHmT1Qf6kEca06LxfZGsmEFc\"",
		"mtime": "2026-07-08T03:02:39.429Z",
		"size": 8616,
		"path": "../public/assets/permission-tree-DMLr6wMa.js"
	},
	"/assets/package-zBuh_lwF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a-q6pg6frt6S2mtd+JuOMyv340FTg\"",
		"mtime": "2026-07-08T03:02:39.415Z",
		"size": 362,
		"path": "../public/assets/package-zBuh_lwF.js"
	},
	"/assets/popover--EHggIRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1517-U1ycXnKQMWQs2zfhUeomoqqF+3Y\"",
		"mtime": "2026-07-08T03:02:39.448Z",
		"size": 5399,
		"path": "../public/assets/popover--EHggIRA.js"
	},
	"/assets/plus-B0TzuU2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-TZ10bQPZvLvYldPgHwDxiJttytQ\"",
		"mtime": "2026-07-08T03:02:39.440Z",
		"size": 143,
		"path": "../public/assets/plus-B0TzuU2-.js"
	},
	"/assets/product-store-K2DiiyGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39e-WKNehrZ+bfjyPOVrruaLk1mXORQ\"",
		"mtime": "2026-07-08T03:02:39.458Z",
		"size": 926,
		"path": "../public/assets/product-store-K2DiiyGb.js"
	},
	"/assets/products-CVwwaFBb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2887-+IZwDzoaoqIKUfOhc/BwxufYwZQ\"",
		"mtime": "2026-07-08T03:02:39.462Z",
		"size": 10375,
		"path": "../public/assets/products-CVwwaFBb.js"
	},
	"/assets/permissions-DwsmFmrQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cae-xa4Z+ZJAe9KOsfQ1pf4p7Xm8sgw\"",
		"mtime": "2026-07-08T03:02:39.434Z",
		"size": 11438,
		"path": "../public/assets/permissions-DwsmFmrQ.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-07-08T03:02:39.473Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/register-CbxD-Qg0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ab6-401xwusOh9yhPZr1oeCm/u+tinw\"",
		"mtime": "2026-07-08T03:02:39.488Z",
		"size": 10934,
		"path": "../public/assets/register-CbxD-Qg0.js"
	},
	"/assets/privacy-DN94_NrI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18aa-rubmXJ1CqPHiNxshJtFWwSoHvZw\"",
		"mtime": "2026-07-08T03:02:39.454Z",
		"size": 6314,
		"path": "../public/assets/privacy-DN94_NrI.js"
	},
	"/assets/roles-lQCRE0-_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e09-i4QYfMbZrm7iWGzeAKuFObwAw58\"",
		"mtime": "2026-07-08T03:02:39.491Z",
		"size": 7689,
		"path": "../public/assets/roles-lQCRE0-_.js"
	},
	"/assets/routes-Dn9GLkyl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2440-12Lw8NV3nW4Kd7FiDNSnCg/qzYQ\"",
		"mtime": "2026-07-08T03:02:39.505Z",
		"size": 9280,
		"path": "../public/assets/routes-Dn9GLkyl.js"
	},
	"/assets/redirect-BB44wZa9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-K3qCyv600LQ802/aV+Gg83W7kdk\"",
		"mtime": "2026-07-08T03:02:39.477Z",
		"size": 581,
		"path": "../public/assets/redirect-BB44wZa9.js"
	},
	"/assets/scale-90vuZNr2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-VSVnYUgLw0HPM5zymN2RRL3+T5o\"",
		"mtime": "2026-07-08T03:02:39.509Z",
		"size": 322,
		"path": "../public/assets/scale-90vuZNr2.js"
	},
	"/assets/refresh-cw-L1-f0mAq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-v05VKHom4jXU6+5aRxGXknrjiLM\"",
		"mtime": "2026-07-08T03:02:39.482Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-L1-f0mAq.js"
	},
	"/assets/search-DP84Fvkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-7mMGacZUhOFQgM44/uJ3OfFEuus\"",
		"mtime": "2026-07-08T03:02:39.514Z",
		"size": 164,
		"path": "../public/assets/search-DP84Fvkq.js"
	},
	"/assets/separator-OrAjr1TP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"316-fg2VKKDGOdazj8Bax0kVN1YHM64\"",
		"mtime": "2026-07-08T03:02:39.526Z",
		"size": 790,
		"path": "../public/assets/separator-OrAjr1TP.js"
	},
	"/assets/route-BQwOdXn8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2420-TeDpNyX2LJyMDr3f088RnIqQpiA\"",
		"mtime": "2026-07-08T03:02:39.495Z",
		"size": 9248,
		"path": "../public/assets/route-BQwOdXn8.js"
	},
	"/assets/profile-DOegEIiV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4846-Psn88c41N5GPES7v/4G7lbE4gLo\"",
		"mtime": "2026-07-08T03:02:39.468Z",
		"size": 18502,
		"path": "../public/assets/profile-DOegEIiV.js"
	},
	"/assets/shield-DfLyZZR-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ReGxOqYBEqxwmrUW5Cr8MLsVhDk\"",
		"mtime": "2026-07-08T03:02:39.530Z",
		"size": 262,
		"path": "../public/assets/shield-DfLyZZR-.js"
	},
	"/assets/shield-check-q4JtIrgu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-O4KBj1UwcHzjdo20VrPZLydzZv4\"",
		"mtime": "2026-07-08T03:02:39.536Z",
		"size": 310,
		"path": "../public/assets/shield-check-q4JtIrgu.js"
	},
	"/assets/select-D0mQgsTi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54d2-i7qjfykcfzYBWK0vLs0s47ZpBl8\"",
		"mtime": "2026-07-08T03:02:39.520Z",
		"size": 21714,
		"path": "../public/assets/select-D0mQgsTi.js"
	},
	"/assets/sliders-horizontal-DUzFA1k_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e-59Iw+ya6NF99jPiy8CLsL7HQVHI\"",
		"mtime": "2026-07-08T03:02:39.551Z",
		"size": 606,
		"path": "../public/assets/sliders-horizontal-DUzFA1k_.js"
	},
	"/assets/site-footer-EuKqk0Bn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136f-SxxT6mCN5qMhK+6pso4ZM7qB62M\"",
		"mtime": "2026-07-08T03:02:39.545Z",
		"size": 4975,
		"path": "../public/assets/site-footer-EuKqk0Bn.js"
	},
	"/assets/shopping-cart-OFoyvWnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a-H9I93lp6uAIYYiQUJIeMtC5FW8Y\"",
		"mtime": "2026-07-08T03:02:39.540Z",
		"size": 282,
		"path": "../public/assets/shopping-cart-OFoyvWnD.js"
	},
	"/assets/status-pill-CB8dCP6Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"427-aCtHwXP4lQugovT/PDSuKms1LE0\"",
		"mtime": "2026-07-08T03:02:39.555Z",
		"size": 1063,
		"path": "../public/assets/status-pill-CB8dCP6Q.js"
	},
	"/assets/styles-BvmmDKkW.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16e2d-VzDMUcA7cvKasC2/ElmW13iU41k\"",
		"mtime": "2026-07-08T03:02:39.605Z",
		"size": 93741,
		"path": "../public/assets/styles-BvmmDKkW.css"
	},
	"/assets/tabs-DaEs2hm9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d67-5yOHpkd0p9ldnoGErwS+cHMtp4Y\"",
		"mtime": "2026-07-08T03:02:39.561Z",
		"size": 3431,
		"path": "../public/assets/tabs-DaEs2hm9.js"
	},
	"/assets/terms-D67Nci3c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a95-O7x7l77OhWiptBe0t6jZOd7jLzc\"",
		"mtime": "2026-07-08T03:02:39.565Z",
		"size": 6805,
		"path": "../public/assets/terms-D67Nci3c.js"
	},
	"/assets/table-Cax7_gyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689-fZBxop3l3DhXp182xVd3AD10TrQ\"",
		"mtime": "2026-07-08T03:02:39.557Z",
		"size": 1673,
		"path": "../public/assets/table-Cax7_gyr.js"
	},
	"/assets/textarea-nAdmiCNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"224-qW3GU4L91LGdOVnBc07qgwqoCVk\"",
		"mtime": "2026-07-08T03:02:39.571Z",
		"size": 548,
		"path": "../public/assets/textarea-nAdmiCNE.js"
	},
	"/assets/x-CJiJ5FWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ucm2DLWHui95gxOjm/x+FQ3N7uQ\"",
		"mtime": "2026-07-08T03:02:39.581Z",
		"size": 144,
		"path": "../public/assets/x-CJiJ5FWm.js"
	},
	"/assets/users-sVPDNsy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-C3Sw/Rg6gLsjzFm8Yb9ROrCWa9o\"",
		"mtime": "2026-07-08T03:02:39.577Z",
		"size": 296,
		"path": "../public/assets/users-sVPDNsy5.js"
	},
	"/assets/zap-B4ObUm5r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf-XdqASmq0hjP5ymDHC+F9FiMGZRE\"",
		"mtime": "2026-07-08T03:02:39.587Z",
		"size": 463,
		"path": "../public/assets/zap-B4ObUm5r.js"
	},
	"/assets/users-BNOEuWgZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c06-tXOfJK+VGv85uIOIuVWeUSSSc98\"",
		"mtime": "2026-07-08T03:02:39.575Z",
		"size": 11270,
		"path": "../public/assets/users-BNOEuWgZ.js"
	},
	"/assets/_id-DaI9zTjz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2546-no0yPABbdAB9Kgy5Dj8YRR4CX6o\"",
		"mtime": "2026-07-08T03:02:39.191Z",
		"size": 9542,
		"path": "../public/assets/_id-DaI9zTjz.js"
	},
	"/assets/_id.edit-CFJxEifZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"539-SO/WQ2ydxUtVn8iM0WffX8mqpuo\"",
		"mtime": "2026-07-08T03:02:39.200Z",
		"size": 1337,
		"path": "../public/assets/_id.edit-CFJxEifZ.js"
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
