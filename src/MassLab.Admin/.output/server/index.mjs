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
	"/assets/-product-form-CRNzA7Vq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fd-LHpAs1DaUPiFDCOeG6YjPUUX1Jw\"",
		"mtime": "2026-07-07T08:50:58.545Z",
		"size": 8445,
		"path": "../public/assets/-product-form-CRNzA7Vq.js"
	},
	"/assets/app-sidebar-B-W8Rom5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d38-Qywx+gfmIEqsUIn7ZUuWJJ1fjCw\"",
		"mtime": "2026-07-07T08:50:58.552Z",
		"size": 27960,
		"path": "../public/assets/app-sidebar-B-W8Rom5.js"
	},
	"/assets/arrow-left-Bx06Roqm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-z9ZXDoi19MWAoR+KIcVha0XZ5+4\"",
		"mtime": "2026-07-07T08:50:58.558Z",
		"size": 155,
		"path": "../public/assets/arrow-left-Bx06Roqm.js"
	},
	"/assets/alert-dialog-WOnrMQgl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e58-Ak54qBgTkT7pzx5S0Nm79WJpomU\"",
		"mtime": "2026-07-07T08:50:58.552Z",
		"size": 3672,
		"path": "../public/assets/alert-dialog-WOnrMQgl.js"
	},
	"/assets/arrow-right-CGhLya19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-26ZfztRHEaJuRh39P/gKQo7RL8c\"",
		"mtime": "2026-07-07T08:50:58.561Z",
		"size": 155,
		"path": "../public/assets/arrow-right-CGhLya19.js"
	},
	"/assets/auth-UwEPCpq9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cae-qBfvuvL33q20ZnUA5SrdtFDmpUA\"",
		"mtime": "2026-07-07T08:50:58.561Z",
		"size": 3246,
		"path": "../public/assets/auth-UwEPCpq9.js"
	},
	"/assets/badge-7-Ho9b7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"321-Cp2t7CGo+qWxs4Pq2kPmJGtM32s\"",
		"mtime": "2026-07-07T08:50:58.565Z",
		"size": 801,
		"path": "../public/assets/badge-7-Ho9b7U.js"
	},
	"/assets/building-2-VG3ReY6h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-pYM5T3Ktkkd5t6VmbyuSn5KjTuw\"",
		"mtime": "2026-07-07T08:50:58.568Z",
		"size": 373,
		"path": "../public/assets/building-2-VG3ReY6h.js"
	},
	"/assets/button-DmhCz2Mk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7fc1-V5sIW2AlphrMaKHzpy2NvrhmiuQ\"",
		"mtime": "2026-07-07T08:50:58.570Z",
		"size": 32705,
		"path": "../public/assets/button-DmhCz2Mk.js"
	},
	"/assets/card-CeFC1A2L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"439-lqXuZvDfkR8IeVRpt+MNWg/HR0Q\"",
		"mtime": "2026-07-07T08:50:58.572Z",
		"size": 1081,
		"path": "../public/assets/card-CeFC1A2L.js"
	},
	"/assets/checkbox-BmTnZDqk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fad-ddbJwnOVb92ZX8q8gXKUATOMyek\"",
		"mtime": "2026-07-07T08:50:58.572Z",
		"size": 4013,
		"path": "../public/assets/checkbox-BmTnZDqk.js"
	},
	"/assets/dist-BK1aWbYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dfe-P7OQVOxYugddMQD3Xq/8vdkzWec\"",
		"mtime": "2026-07-07T08:50:58.584Z",
		"size": 3582,
		"path": "../public/assets/dist-BK1aWbYL.js"
	},
	"/assets/dashboard-Dm5KvQBq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"193c-IPltG0fUmq8ox+L8oN9WgsEBw/s\"",
		"mtime": "2026-07-07T08:50:58.578Z",
		"size": 6460,
		"path": "../public/assets/dashboard-Dm5KvQBq.js"
	},
	"/assets/clients-I-xCaxkI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c19-F3FgjYeQlVEcWLp/Pq4kpALj/uk\"",
		"mtime": "2026-07-07T08:50:58.576Z",
		"size": 11289,
		"path": "../public/assets/clients-I-xCaxkI.js"
	},
	"/assets/dist-Bl3LZ0f2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a7-voakJyEjdbQIMwna7F9LWq3BEsE\"",
		"mtime": "2026-07-07T08:50:58.587Z",
		"size": 1447,
		"path": "../public/assets/dist-Bl3LZ0f2.js"
	},
	"/assets/dialog-BwzIt4Eg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86f-jn/UM24JWWP5n/HfQty4hTGE60A\"",
		"mtime": "2026-07-07T08:50:58.581Z",
		"size": 2159,
		"path": "../public/assets/dialog-BwzIt4Eg.js"
	},
	"/assets/dist-Bnma_7oL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d068-26FVdIl3m3JU6FHVlNG0EK5xN40\"",
		"mtime": "2026-07-07T08:50:58.589Z",
		"size": 53352,
		"path": "../public/assets/dist-Bnma_7oL.js"
	},
	"/assets/dist-PZR7TGGB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-iBi9IkYXQg+fEDi4wLvTq3Ho5p4\"",
		"mtime": "2026-07-07T08:50:58.600Z",
		"size": 246,
		"path": "../public/assets/dist-PZR7TGGB.js"
	},
	"/assets/docs-Dgfc6fmm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fb-uvGk8GWpIFPIPKJRyrkkBiGUL8o\"",
		"mtime": "2026-07-07T08:50:58.606Z",
		"size": 6651,
		"path": "../public/assets/docs-Dgfc6fmm.js"
	},
	"/assets/dist-qOHRhbD9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a9-nWZbYuNR7XqFMzdnW9Eg0/lfGWY\"",
		"mtime": "2026-07-07T08:50:58.602Z",
		"size": 4265,
		"path": "../public/assets/dist-qOHRhbD9.js"
	},
	"/assets/dist-KBj6NEsk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c8-W2R167uqdBydT+iP9ucFdlnn5/Q\"",
		"mtime": "2026-07-07T08:50:58.596Z",
		"size": 456,
		"path": "../public/assets/dist-KBj6NEsk.js"
	},
	"/assets/dropdown-menu-zidETzqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542d-9/+wT8H2hcb1Bc1A38+gGaKxgak\"",
		"mtime": "2026-07-07T08:50:58.610Z",
		"size": 21549,
		"path": "../public/assets/dropdown-menu-zidETzqa.js"
	},
	"/assets/ellipsis-DR_Plbtk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8-9HTY5vvqGU/2Z4bd3pnj/4+5uQ0\"",
		"mtime": "2026-07-07T08:50:58.611Z",
		"size": 216,
		"path": "../public/assets/ellipsis-DR_Plbtk.js"
	},
	"/assets/eye-off-fRCjuNAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-WyFSpIfW6SvRN2bhLrO8PyEaq/A\"",
		"mtime": "2026-07-07T08:50:58.616Z",
		"size": 420,
		"path": "../public/assets/eye-off-fRCjuNAk.js"
	},
	"/assets/eye-D8-Mdidb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-FlKPM3+ybed96LxFML8LsBfq/mQ\"",
		"mtime": "2026-07-07T08:50:58.614Z",
		"size": 246,
		"path": "../public/assets/eye-D8-Mdidb.js"
	},
	"/assets/flag-DD0snF45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b6-/+gQgMzanchn4Kouz2Qgrt45O24\"",
		"mtime": "2026-07-07T08:50:58.616Z",
		"size": 1206,
		"path": "../public/assets/flag-DD0snF45.js"
	},
	"/assets/index-CaNX9NNj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"658ca-dO351n/vsjtvhJWeSbtB5V7tl0M\"",
		"mtime": "2026-07-07T08:50:58.545Z",
		"size": 415946,
		"path": "../public/assets/index-CaNX9NNj.js"
	},
	"/assets/globe-BMvZWZTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-+46YoiAJVzx4pM4oagCOf7EMj98\"",
		"mtime": "2026-07-07T08:50:58.616Z",
		"size": 232,
		"path": "../public/assets/globe-BMvZWZTv.js"
	},
	"/assets/input-D8884eIo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-KMrdVux+RWPMgNigwa7s5w5oqO0\"",
		"mtime": "2026-07-07T08:50:58.624Z",
		"size": 650,
		"path": "../public/assets/input-D8884eIo.js"
	},
	"/assets/identity-api-B1nx1Gho.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31d-QXfCsDNkVayVsuW70pJjheHbbVY\"",
		"mtime": "2026-07-07T08:50:58.622Z",
		"size": 797,
		"path": "../public/assets/identity-api-B1nx1Gho.js"
	},
	"/assets/key-round-J8cr9QLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-M6yfsRXNkoig/8dQQRwZvsaP7zg\"",
		"mtime": "2026-07-07T08:50:58.631Z",
		"size": 345,
		"path": "../public/assets/key-round-J8cr9QLF.js"
	},
	"/assets/jsx-runtime-o5jPw3Cc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-LpLuxQCdJgpHmoojm7lmOrrsJYM\"",
		"mtime": "2026-07-07T08:50:58.626Z",
		"size": 3907,
		"path": "../public/assets/jsx-runtime-o5jPw3Cc.js"
	},
	"/assets/lock-BhDAibts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-jlB/CY5yssBxT/+3Yl28/xeoRdM\"",
		"mtime": "2026-07-07T08:50:58.635Z",
		"size": 196,
		"path": "../public/assets/lock-BhDAibts.js"
	},
	"/assets/link-Dnf6elyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5af9-2nt5PaA3GFl9MJgUTpJfukaUc04\"",
		"mtime": "2026-07-07T08:50:58.635Z",
		"size": 23289,
		"path": "../public/assets/link-Dnf6elyJ.js"
	},
	"/assets/label-CNMVERJ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28e-zG6Q+seea+d4TMAaxZjISxQfI20\"",
		"mtime": "2026-07-07T08:50:58.635Z",
		"size": 654,
		"path": "../public/assets/label-CNMVERJ1.js"
	},
	"/assets/loader-circle-uU63VXRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-dXANIrj44e61BOXqaOdEQeG7JVQ\"",
		"mtime": "2026-07-07T08:50:58.635Z",
		"size": 134,
		"path": "../public/assets/loader-circle-uU63VXRI.js"
	},
	"/assets/logout-complete-CBlGoZH8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-3Hpg2AfqwfsfqV2msaKtbd2vSI4\"",
		"mtime": "2026-07-07T08:50:58.647Z",
		"size": 212,
		"path": "../public/assets/logout-complete-CBlGoZH8.js"
	},
	"/assets/login-CsVTNWWi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20bf-tQ7BZq90X5ncneLoaABQXxA6ycY\"",
		"mtime": "2026-07-07T08:50:58.641Z",
		"size": 8383,
		"path": "../public/assets/login-CsVTNWWi.js"
	},
	"/assets/logo-CwfX0Hat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15e-cFhdKwLhDBeZrD3Oe1NnRz/dMp0\"",
		"mtime": "2026-07-07T08:50:58.645Z",
		"size": 350,
		"path": "../public/assets/logo-CwfX0Hat.js"
	},
	"/assets/mail-BS81OhPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-f5wxLDHGyR6foQucOR5gzPve+Ew\"",
		"mtime": "2026-07-07T08:50:58.649Z",
		"size": 203,
		"path": "../public/assets/mail-BS81OhPs.js"
	},
	"/assets/MassLab_Logo_2-BeGIoRfl.png": {
		"type": "image/png",
		"etag": "\"5981a-FgP6SzancoTpaptGuKQm54DzOcg\"",
		"mtime": "2026-07-07T08:50:58.771Z",
		"size": 366618,
		"path": "../public/assets/MassLab_Logo_2-BeGIoRfl.png"
	},
	"/assets/mock-data-t_Rxtj6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c21-GSPZ0t1OombOCcZvzDFXomkZWeE\"",
		"mtime": "2026-07-07T08:50:58.649Z",
		"size": 7201,
		"path": "../public/assets/mock-data-t_Rxtj6u.js"
	},
	"/assets/MassLab_Logo_3-B-bl3OSo.png": {
		"type": "image/png",
		"etag": "\"288b7-MA7XM61fDiXeCBp157I7OOjkN+0\"",
		"mtime": "2026-07-07T08:50:58.771Z",
		"size": 166071,
		"path": "../public/assets/MassLab_Logo_3-B-bl3OSo.png"
	},
	"/assets/new-BlBGBygj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-QqThk+UvhUq5g7azLmLj3Dm2pZU\"",
		"mtime": "2026-07-07T08:50:58.652Z",
		"size": 711,
		"path": "../public/assets/new-BlBGBygj.js"
	},
	"/assets/oidc-DhM2l5i4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10da-si4mMeAp0PbaPnIRm+nf4/3xo/g\"",
		"mtime": "2026-07-07T08:50:58.654Z",
		"size": 4314,
		"path": "../public/assets/oidc-DhM2l5i4.js"
	},
	"/assets/MassLab_Favicon-D1kQ6cJW.png": {
		"type": "image/png",
		"etag": "\"79e63-897pp1N0MRLUJ/J4qQ2V8S/g9M4\"",
		"mtime": "2026-07-07T08:50:58.769Z",
		"size": 499299,
		"path": "../public/assets/MassLab_Favicon-D1kQ6cJW.png"
	},
	"/assets/order-store-BcPUlqqB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"217-DU2WAJzx7ff5HJI0BBeMEmELVcc\"",
		"mtime": "2026-07-07T08:50:58.657Z",
		"size": 535,
		"path": "../public/assets/order-store-BcPUlqqB.js"
	},
	"/assets/orders-CsiBszDo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cf8-ngQ3q2EtN9kgMllhlcobcQny1Sk\"",
		"mtime": "2026-07-07T08:50:58.657Z",
		"size": 11512,
		"path": "../public/assets/orders-CsiBszDo.js"
	},
	"/assets/organizations-bGqLwycm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b77-7Hz5foiy5cbBuXrcKnAJ8gpCbAg\"",
		"mtime": "2026-07-07T08:50:58.661Z",
		"size": 7031,
		"path": "../public/assets/organizations-bGqLwycm.js"
	},
	"/assets/package-zBuh_lwF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a-q6pg6frt6S2mtd+JuOMyv340FTg\"",
		"mtime": "2026-07-07T08:50:58.665Z",
		"size": 362,
		"path": "../public/assets/package-zBuh_lwF.js"
	},
	"/assets/plus-B0TzuU2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-TZ10bQPZvLvYldPgHwDxiJttytQ\"",
		"mtime": "2026-07-07T08:50:58.678Z",
		"size": 143,
		"path": "../public/assets/plus-B0TzuU2-.js"
	},
	"/assets/popover--EHggIRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1517-U1ycXnKQMWQs2zfhUeomoqqF+3Y\"",
		"mtime": "2026-07-07T08:50:58.678Z",
		"size": 5399,
		"path": "../public/assets/popover--EHggIRA.js"
	},
	"/assets/permissions-BOtoskxb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cae-7N26bA+ZuqmkC+pNISJDS3gqDjI\"",
		"mtime": "2026-07-07T08:50:58.674Z",
		"size": 11438,
		"path": "../public/assets/permissions-BOtoskxb.js"
	},
	"/assets/privacy-B88s7Pl7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18aa-w2M4y3On3SNfhdRJDojW3wbn5I8\"",
		"mtime": "2026-07-07T08:50:58.685Z",
		"size": 6314,
		"path": "../public/assets/privacy-B88s7Pl7.js"
	},
	"/assets/products-DlsumR3S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2887-n+HrMla+AYWApM97FsbQbYMU/9o\"",
		"mtime": "2026-07-07T08:50:58.690Z",
		"size": 10375,
		"path": "../public/assets/products-DlsumR3S.js"
	},
	"/assets/product-store-K2DiiyGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39e-WKNehrZ+bfjyPOVrruaLk1mXORQ\"",
		"mtime": "2026-07-07T08:50:58.687Z",
		"size": 926,
		"path": "../public/assets/product-store-K2DiiyGb.js"
	},
	"/assets/permission-tree-DMLr6wMa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21a8-eNCKHmT1Qf6kEca06LxfZGsmEFc\"",
		"mtime": "2026-07-07T08:50:58.670Z",
		"size": 8616,
		"path": "../public/assets/permission-tree-DMLr6wMa.js"
	},
	"/assets/redirect-BB44wZa9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-K3qCyv600LQ802/aV+Gg83W7kdk\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 581,
		"path": "../public/assets/redirect-BB44wZa9.js"
	},
	"/assets/refresh-cw-L1-f0mAq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-v05VKHom4jXU6+5aRxGXknrjiLM\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-L1-f0mAq.js"
	},
	"/assets/profile-B2ZK6TU-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4846-esTI00ayZRKwyE0LmBvogxgsMds\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 18502,
		"path": "../public/assets/profile-B2ZK6TU-.js"
	},
	"/assets/register-CmZe1BF1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a2c-rNC7gjORCYfBxR7QGEg2OOOEdfA\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 10796,
		"path": "../public/assets/register-CmZe1BF1.js"
	},
	"/assets/route-CU0ezqmf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2478-YOQV9yecIf2b85aKkIpLEnfMjWA\"",
		"mtime": "2026-07-07T08:50:58.712Z",
		"size": 9336,
		"path": "../public/assets/route-CU0ezqmf.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/scale-90vuZNr2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-VSVnYUgLw0HPM5zymN2RRL3+T5o\"",
		"mtime": "2026-07-07T08:50:58.715Z",
		"size": 322,
		"path": "../public/assets/scale-90vuZNr2.js"
	},
	"/assets/search-DP84Fvkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-7mMGacZUhOFQgM44/uJ3OfFEuus\"",
		"mtime": "2026-07-07T08:50:58.715Z",
		"size": 164,
		"path": "../public/assets/search-DP84Fvkq.js"
	},
	"/assets/select-D0mQgsTi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54d2-i7qjfykcfzYBWK0vLs0s47ZpBl8\"",
		"mtime": "2026-07-07T08:50:58.715Z",
		"size": 21714,
		"path": "../public/assets/select-D0mQgsTi.js"
	},
	"/assets/routes-U35DE07e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"248d-I9xjPN7p4agL30vEEvC8hgmPL08\"",
		"mtime": "2026-07-07T08:50:58.715Z",
		"size": 9357,
		"path": "../public/assets/routes-U35DE07e.js"
	},
	"/assets/separator-OrAjr1TP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"316-fg2VKKDGOdazj8Bax0kVN1YHM64\"",
		"mtime": "2026-07-07T08:50:58.715Z",
		"size": 790,
		"path": "../public/assets/separator-OrAjr1TP.js"
	},
	"/assets/roles-DptKph4K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e09-J52S8ExbH5YYJMpr5TJcUPpwTk4\"",
		"mtime": "2026-07-07T08:50:58.694Z",
		"size": 7689,
		"path": "../public/assets/roles-DptKph4K.js"
	},
	"/assets/shield-DfLyZZR-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ReGxOqYBEqxwmrUW5Cr8MLsVhDk\"",
		"mtime": "2026-07-07T08:50:58.728Z",
		"size": 262,
		"path": "../public/assets/shield-DfLyZZR-.js"
	},
	"/assets/shopping-cart-OFoyvWnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a-H9I93lp6uAIYYiQUJIeMtC5FW8Y\"",
		"mtime": "2026-07-07T08:50:58.731Z",
		"size": 282,
		"path": "../public/assets/shopping-cart-OFoyvWnD.js"
	},
	"/assets/shield-check-q4JtIrgu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-O4KBj1UwcHzjdo20VrPZLydzZv4\"",
		"mtime": "2026-07-07T08:50:58.731Z",
		"size": 310,
		"path": "../public/assets/shield-check-q4JtIrgu.js"
	},
	"/assets/site-footer-DJy9cgMM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13b7-STJA5irZ5qcm9SbsPw5iwN/v7MQ\"",
		"mtime": "2026-07-07T08:50:58.731Z",
		"size": 5047,
		"path": "../public/assets/site-footer-DJy9cgMM.js"
	},
	"/assets/sliders-horizontal-DUzFA1k_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e-59Iw+ya6NF99jPiy8CLsL7HQVHI\"",
		"mtime": "2026-07-07T08:50:58.731Z",
		"size": 606,
		"path": "../public/assets/sliders-horizontal-DUzFA1k_.js"
	},
	"/assets/status-pill-CB8dCP6Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"427-aCtHwXP4lQugovT/PDSuKms1LE0\"",
		"mtime": "2026-07-07T08:50:58.745Z",
		"size": 1063,
		"path": "../public/assets/status-pill-CB8dCP6Q.js"
	},
	"/assets/table-Cax7_gyr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689-fZBxop3l3DhXp182xVd3AD10TrQ\"",
		"mtime": "2026-07-07T08:50:58.747Z",
		"size": 1673,
		"path": "../public/assets/table-Cax7_gyr.js"
	},
	"/assets/tabs-DaEs2hm9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d67-5yOHpkd0p9ldnoGErwS+cHMtp4Y\"",
		"mtime": "2026-07-07T08:50:58.747Z",
		"size": 3431,
		"path": "../public/assets/tabs-DaEs2hm9.js"
	},
	"/assets/terms-TrASZPL9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a95-AZo7gYF6h7TtN2cTrYBI557LJcA\"",
		"mtime": "2026-07-07T08:50:58.747Z",
		"size": 6805,
		"path": "../public/assets/terms-TrASZPL9.js"
	},
	"/assets/textarea-nAdmiCNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"224-qW3GU4L91LGdOVnBc07qgwqoCVk\"",
		"mtime": "2026-07-07T08:50:58.758Z",
		"size": 548,
		"path": "../public/assets/textarea-nAdmiCNE.js"
	},
	"/assets/styles-BvmmDKkW.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16e2d-VzDMUcA7cvKasC2/ElmW13iU41k\"",
		"mtime": "2026-07-07T08:50:58.773Z",
		"size": 93741,
		"path": "../public/assets/styles-BvmmDKkW.css"
	},
	"/assets/users-sVPDNsy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-C3Sw/Rg6gLsjzFm8Yb9ROrCWa9o\"",
		"mtime": "2026-07-07T08:50:58.762Z",
		"size": 296,
		"path": "../public/assets/users-sVPDNsy5.js"
	},
	"/assets/x-CJiJ5FWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ucm2DLWHui95gxOjm/x+FQ3N7uQ\"",
		"mtime": "2026-07-07T08:50:58.762Z",
		"size": 144,
		"path": "../public/assets/x-CJiJ5FWm.js"
	},
	"/assets/users-QsTVBbB_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c06-pWpxBawZpk/HsCcvaq2bmdKEvcw\"",
		"mtime": "2026-07-07T08:50:58.761Z",
		"size": 11270,
		"path": "../public/assets/users-QsTVBbB_.js"
	},
	"/assets/zap-B4ObUm5r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf-XdqASmq0hjP5ymDHC+F9FiMGZRE\"",
		"mtime": "2026-07-07T08:50:58.766Z",
		"size": 463,
		"path": "../public/assets/zap-B4ObUm5r.js"
	},
	"/assets/_id.edit-DVsC3TUb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"539-ZsqrDzbtoXVsMFtIaGHA63f+1BQ\"",
		"mtime": "2026-07-07T08:50:58.550Z",
		"size": 1337,
		"path": "../public/assets/_id.edit-DVsC3TUb.js"
	},
	"/assets/_id-CfXmXJLv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2546-piDcmDFhAJx0oYk6e3kf+MfUUqk\"",
		"mtime": "2026-07-07T08:50:58.548Z",
		"size": 9542,
		"path": "../public/assets/_id-CfXmXJLv.js"
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
