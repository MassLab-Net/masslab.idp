import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as I18nProvider } from "./i18n-D_HxFyu3.mjs";
import { F as useRouter, O as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$16 } from "./organizations-DNmoE0r-.mjs";
import { t as Route$17 } from "../_id-BA7kSB0j.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$18 } from "../_id.edit-BJ-shdPy.mjs";
import { n as getStoredSession, t as AuthProvider } from "./auth-CZt5-1jc.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BrP_9yUV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-ZHN5Lpvq.css";
var MassLab_Favicon_default = "/assets/MassLab_Favicon-D1kQ6cJW.png";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-gradient-brand",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-opacity hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MassLab IAM — Identity & Access for modern teams" },
			{
				name: "description",
				content: "Enterprise Identity & Access Management. Manage users, roles, permissions and organizations across a multi-tenant platform."
			},
			{
				property: "og:title",
				content: "MassLab IAM"
			},
			{
				property: "og:description",
				content: "Identity & Access Management for modern teams."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: MassLab_Favicon_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }) })
	});
}
var $$splitComponentImporter$14 = () => import("./terms-7-TaEKrK.mjs");
var Route$14 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms of Service — MassLab IAM" }, {
		name: "description",
		content: "MassLab IAM Terms of Service - The rules and guidelines for using our platform."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./register-go_HAV5u.mjs");
var Route$13 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create account — MassLab IAM" }, {
		name: "description",
		content: "Create a new MassLab IAM account for your organization."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./privacy-B7J_oTpH.mjs");
var Route$12 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy Policy — MassLab IAM" }, {
		name: "description",
		content: "MassLab IAM Privacy Policy - How we collect, use, and protect your data."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./docs-UChwZoEA.mjs");
var Route$11 = createFileRoute("/docs")({
	head: () => ({ meta: [{ title: "Documentation — MassLab IAM" }, {
		name: "description",
		content: "MassLab IAM Documentation - Learn how to integrate, configure, and use the platform."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./auth-CrLi53Gw.mjs");
var Route$10 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — MassLab IAM" }, {
		name: "description",
		content: "Sign in to MassLab IAM with username, Google, or Microsoft Entra ID."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./route-DyIEtAf5.mjs");
var Route$9 = createFileRoute("/admin")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		if (!getStoredSession()) throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./routes-D6A41Ds0.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "MassLab IAM — Identity & Access for modern teams" }, {
		name: "description",
		content: "Enterprise Identity & Access Management. Multi-tenant RBAC, SSO, and audit-ready compliance."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./profile-DPNMYbAc.mjs");
var Route$7 = createFileRoute("/admin/profile")({
	head: () => ({ meta: [{ title: "My Profile — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-DTrf0Syz.mjs");
var Route$6 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./products-QUeFuO-e.mjs");
var Route$5 = createFileRoute("/admin/products/")({
	head: () => ({ meta: [{ title: "Products — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./orders-JfTG8UqX.mjs");
var Route$4 = createFileRoute("/admin/orders/")({
	head: () => ({ meta: [{ title: "Orders — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./new-DvSYcKji.mjs");
var Route$3 = createFileRoute("/admin/products/new")({
	head: () => ({ meta: [{ title: "New Product — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./users-DWGiImFh.mjs");
var Route$2 = createFileRoute("/admin/access-control/users")({
	head: () => ({ meta: [{ title: "Users — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./roles-Bui5E7GB.mjs");
var Route$1 = createFileRoute("/admin/access-control/roles")({
	head: () => ({ meta: [{ title: "Roles — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./permissions-DGpA-URk.mjs");
var Route = createFileRoute("/admin/access-control/permissions")({
	head: () => ({ meta: [{ title: "Permissions — MassLab IAM" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TermsRoute = Route$14.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$15
});
var RegisterRoute = Route$13.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$15
});
var PrivacyRoute = Route$12.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$15
});
var DocsRoute = Route$11.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$15
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$15
});
var AdminRouteRoute = Route$9.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$15
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AdminProfileRoute = Route$7.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AdminRouteRoute
});
var AdminDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRouteRoute
});
var AdminProductsIndexRoute = Route$5.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrdersIndexRoute = Route$4.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => AdminRouteRoute
});
var AdminTenantOrganizationsRoute = Route$16.update({
	id: "/tenant/organizations",
	path: "/tenant/organizations",
	getParentRoute: () => AdminRouteRoute
});
var AdminProductsNewRoute = Route$3.update({
	id: "/products/new",
	path: "/products/new",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrdersIdRoute = Route$17.update({
	id: "/orders/$id",
	path: "/orders/$id",
	getParentRoute: () => AdminRouteRoute
});
var AdminAccessControlUsersRoute = Route$2.update({
	id: "/access-control/users",
	path: "/access-control/users",
	getParentRoute: () => AdminRouteRoute
});
var AdminAccessControlRolesRoute = Route$1.update({
	id: "/access-control/roles",
	path: "/access-control/roles",
	getParentRoute: () => AdminRouteRoute
});
var AdminRouteRouteChildren = {
	AdminDashboardRoute,
	AdminProfileRoute,
	AdminAccessControlPermissionsRoute: Route.update({
		id: "/access-control/permissions",
		path: "/access-control/permissions",
		getParentRoute: () => AdminRouteRoute
	}),
	AdminAccessControlRolesRoute,
	AdminAccessControlUsersRoute,
	AdminOrdersIdRoute,
	AdminProductsNewRoute,
	AdminTenantOrganizationsRoute,
	AdminOrdersIndexRoute,
	AdminProductsIndexRoute,
	AdminProductsIdEditRoute: Route$18.update({
		id: "/products/$id/edit",
		path: "/products/$id/edit",
		getParentRoute: () => AdminRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRoute._addFileChildren(AdminRouteRouteChildren),
	AuthRoute,
	DocsRoute,
	PrivacyRoute,
	RegisterRoute,
	TermsRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
