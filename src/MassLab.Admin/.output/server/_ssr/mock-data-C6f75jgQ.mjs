//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-C6f75jgQ.js
var ORGANIZATIONS = [
	{
		id: "org_1",
		name: "Acme Corporation",
		slug: "acme",
		plan: "Enterprise",
		members: 248,
		status: "Active",
		createdAt: "2024-02-11"
	},
	{
		id: "org_2",
		name: "Northwind Labs",
		slug: "northwind",
		plan: "Business",
		members: 64,
		status: "Active",
		createdAt: "2024-08-03"
	},
	{
		id: "org_3",
		name: "Contoso Bank",
		slug: "contoso",
		plan: "Enterprise",
		members: 1290,
		status: "Active",
		createdAt: "2023-05-22"
	},
	{
		id: "org_4",
		name: "Globex Health",
		slug: "globex",
		plan: "Business",
		members: 88,
		status: "Suspended",
		createdAt: "2025-01-14"
	},
	{
		id: "org_5",
		name: "Initech Studio",
		slug: "initech",
		plan: "Starter",
		members: 9,
		status: "Active",
		createdAt: "2025-09-30"
	}
];
var ROLES = [
	{
		id: "role_admin",
		name: "Super Administrator",
		description: "Full access to every module across the tenant.",
		permissions: [
			{
				id: "iam",
				name: "Identity & Access",
				permissions: [
					{
						id: "iam.users.read",
						name: "View users"
					},
					{
						id: "iam.users.write",
						name: "Create & edit users"
					},
					{
						id: "iam.users.delete",
						name: "Delete users"
					},
					{
						id: "iam.users.invite",
						name: "Invite users"
					},
					{
						id: "iam.roles.read",
						name: "View roles"
					},
					{
						id: "iam.roles.write",
						name: "Create & edit roles"
					},
					{
						id: "iam.roles.delete",
						name: "Delete roles"
					},
					{
						id: "iam.permissions.read",
						name: "View permissions"
					},
					{
						id: "iam.permissions.write",
						name: "Assign permissions"
					}
				]
			},
			{
				id: "org",
				name: "Organization",
				permissions: [
					{
						id: "org.settings.read",
						name: "View organization settings"
					},
					{
						id: "org.settings.write",
						name: "Edit organization settings"
					},
					{
						id: "org.billing.read",
						name: "View billing"
					},
					{
						id: "org.billing.write",
						name: "Manage billing"
					},
					{
						id: "org.audit.read",
						name: "View audit logs"
					}
				]
			},
			{
				id: "directory",
				name: "Directory & SSO",
				permissions: [
					{
						id: "directory.sync.read",
						name: "View directory sync"
					},
					{
						id: "directory.sync.write",
						name: "Configure directory sync"
					},
					{
						id: "directory.sso.read",
						name: "View SSO"
					},
					{
						id: "directory.sso.write",
						name: "Configure SSO providers"
					}
				]
			},
			{
				id: "api",
				name: "API & Integrations",
				permissions: [
					{
						id: "api.tokens.read",
						name: "View API tokens"
					},
					{
						id: "api.tokens.write",
						name: "Create API tokens"
					},
					{
						id: "api.webhooks.read",
						name: "View webhooks"
					},
					{
						id: "api.webhooks.write",
						name: "Manage webhooks"
					}
				]
			},
			{
				id: "reports",
				name: "Reports & Analytics",
				permissions: [{
					id: "reports.read",
					name: "View reports"
				}, {
					id: "reports.export",
					name: "Export reports"
				}]
			}
		].flatMap((m) => m.permissions.map((p) => p.id)),
		users: 4,
		system: true
	},
	{
		id: "role_org_admin",
		name: "Organization Admin",
		description: "Manage organization, members, and billing.",
		permissions: [
			"iam.users.read",
			"iam.users.write",
			"iam.users.invite",
			"iam.roles.read",
			"org.settings.read",
			"org.settings.write",
			"org.billing.read",
			"org.audit.read"
		],
		users: 12,
		system: false
	},
	{
		id: "role_security",
		name: "Security Engineer",
		description: "Audit logs, SSO, and directory sync configuration.",
		permissions: [
			"iam.users.read",
			"iam.roles.read",
			"iam.permissions.read",
			"directory.sync.read",
			"directory.sync.write",
			"directory.sso.read",
			"directory.sso.write",
			"org.audit.read"
		],
		users: 7,
		system: false
	},
	{
		id: "role_developer",
		name: "Developer",
		description: "API tokens, webhooks, and read-only directory.",
		permissions: [
			"api.tokens.read",
			"api.tokens.write",
			"api.webhooks.read",
			"api.webhooks.write",
			"iam.users.read"
		],
		users: 34,
		system: false
	},
	{
		id: "role_analyst",
		name: "Analyst",
		description: "Read-only access to reports and analytics.",
		permissions: [
			"reports.read",
			"reports.export",
			"iam.users.read"
		],
		users: 18,
		system: false
	},
	{
		id: "role_viewer",
		name: "Viewer",
		description: "Read-only across IAM screens.",
		permissions: [
			"iam.users.read",
			"iam.roles.read",
			"iam.permissions.read"
		],
		users: 92,
		system: true
	}
];
var FIRST = [
	"Linh",
	"Minh",
	"Aiden",
	"Sofia",
	"Hai",
	"Ravi",
	"Yuki",
	"Emma",
	"Quan",
	"Noah",
	"Mai",
	"Jonas",
	"Ngoc",
	"Priya",
	"Lucas",
	"Anh",
	"Olivia",
	"Ethan",
	"Trang",
	"Daniel"
];
var LAST = [
	"Nguyen",
	"Tran",
	"Le",
	"Pham",
	"Garcia",
	"Smith",
	"Brown",
	"Kim",
	"Tanaka",
	"Singh",
	"Pereira",
	"Vu",
	"Hoang",
	"Bui",
	"Do",
	"Walker",
	"Chen",
	"Anderson",
	"Cole",
	"Bach"
];
var STATUSES = [
	"Active",
	"Active",
	"Active",
	"Invited",
	"Disabled",
	"Active"
];
function rand(arr, i) {
	return arr[i % arr.length];
}
Array.from({ length: 24 }).map((_, i) => {
	const f = rand(FIRST, i * 3 + 1);
	const l = rand(LAST, i * 5 + 2);
	const name = `${f} ${l}`;
	const username = `${f}.${l}`.toLowerCase();
	const roleA = ROLES[(i + 1) % ROLES.length].id;
	const roleB = ROLES[(i + 3) % ROLES.length].id;
	const direct = i % 4 === 0 ? ["org.audit.read"] : i % 5 === 0 ? ["reports.export"] : [];
	return {
		id: `usr_${1e3 + i}`,
		name,
		username,
		email: `${username}@masslab.io`,
		status: rand(STATUSES, i),
		roles: i % 3 === 0 ? [roleA, roleB] : [roleA],
		directPermissions: direct,
		lastActive: `${1 + i % 27} ${[
			"minutes",
			"hours",
			"days"
		][i % 3]} ago`,
		organization: ORGANIZATIONS[i % ORGANIZATIONS.length].name
	};
});
var PRODUCT_NAMES = [
	"IAM Enterprise Suite",
	"Identity Gateway",
	"SSO Connector",
	"Audit Log Pro",
	"Directory Sync Agent",
	"API Access Manager",
	"Role Designer Studio",
	"MFA Hardware Token",
	"Security Dashboard",
	"Compliance Reporter",
	"Webhook Relay",
	"SCIM Provisioner",
	"OAuth2 Toolkit",
	"Zero Trust Module",
	"Biometric Auth Kit",
	"Admin Console License",
	"Developer SDK",
	"Multi-Tenant Platform",
	"Access Policy Engine",
	"Session Manager Pro"
];
var CATEGORIES = [
	"Software",
	"Software",
	"Service",
	"Hardware",
	"Subscription",
	"Software"
];
var STATUSES_P = [
	"Active",
	"Active",
	"Active",
	"Draft",
	"Archived",
	"Active"
];
var PRICES = [
	49,
	99,
	149,
	199,
	299,
	399,
	499,
	799,
	999,
	1299,
	1999,
	2499
];
var TAGS_POOL = [
	"iam",
	"sso",
	"rbac",
	"audit",
	"compliance",
	"api",
	"mfa",
	"security",
	"enterprise",
	"cloud"
];
var PRODUCTS = Array.from({ length: 20 }).map((_, i) => {
	const price = PRICES[i % PRICES.length];
	const category = CATEGORIES[i % CATEGORIES.length];
	const status = STATUSES_P[i % STATUSES_P.length];
	return {
		id: `prod_${1e3 + i}`,
		sku: `ML-${(1e3 + i * 7).toString().padStart(5, "0")}`,
		category,
		status,
		price,
		currency: "USD",
		stock: status === "Archived" ? 0 : 10 + i * 13 % 490,
		tags: [TAGS_POOL[i % TAGS_POOL.length], TAGS_POOL[(i + 3) % TAGS_POOL.length]],
		translations: {
			en: {
				name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
				description: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} provides enterprise-grade identity and access management capabilities for modern organizations.`
			},
			vi: {
				name: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} (VI)`,
				description: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} cung cấp các năng lực quản lý định danh và truy cập ở cấp doanh nghiệp cho tổ chức hiện đại.`
			}
		},
		createdAt: `2024-${String(1 + i % 12).padStart(2, "0")}-${String(1 + i * 3 % 28).padStart(2, "0")}`,
		updatedAt: `2025-${String(1 + i % 6).padStart(2, "0")}-${String(1 + i * 5 % 28).padStart(2, "0")}`
	};
});
var ORDER_CUSTOMERS = [
	["Elena", "Nguyen"],
	["Marcus", "Chen"],
	["Priya", "Sharma"],
	["Daniel", "Walker"],
	["Linh", "Tran"],
	["Aiden", "Smith"],
	["Sofia", "Garcia"],
	["Hai", "Le"],
	["Olivia", "Brown"],
	["Noah", "Kim"],
	["Mai", "Pham"],
	["Yuki", "Tanaka"]
];
var ORDER_STATUSES = [
	"Pending",
	"Processing",
	"Shipped",
	"Delivered",
	"Cancelled",
	"Refunded",
	"Processing",
	"Shipped"
];
var PAYMENT_STATUSES = [
	"Pending",
	"Paid",
	"Paid",
	"Paid",
	"Refunded",
	"Failed",
	"Paid",
	"Paid"
];
var FULFILLMENT_STATUSES = [
	"Unfulfilled",
	"Partial",
	"Partial",
	"Fulfilled",
	"Unfulfilled",
	"Unfulfilled",
	"Partial",
	"Fulfilled"
];
var ORDERS = Array.from({ length: 18 }).map((_, i) => {
	const [first, last] = ORDER_CUSTOMERS[i % ORDER_CUSTOMERS.length];
	const customerName = `${first} ${last}`;
	const customerEmail = `${first}.${last}`.toLowerCase() + "@masslab.io";
	const org = ORGANIZATIONS[i % ORGANIZATIONS.length].name;
	const productA = PRODUCTS[i * 2 % PRODUCTS.length];
	const productB = PRODUCTS[(i * 2 + 3) % PRODUCTS.length];
	const items = [{
		productId: productA.id,
		name: productA.translations.en.name,
		qty: 1 + i % 3,
		price: productA.price
	}];
	if (i % 2 === 0) items.push({
		productId: productB.id,
		name: productB.translations.en.name,
		qty: 1,
		price: productB.price
	});
	const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
	const shipping = subtotal >= 500 ? 0 : 19.99;
	const tax = Math.round(subtotal * .08 * 100) / 100;
	const total = Math.round((subtotal + shipping + tax) * 100) / 100;
	const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
	const paymentStatus = PAYMENT_STATUSES[i % PAYMENT_STATUSES.length];
	const fulfillmentStatus = FULFILLMENT_STATUSES[i % FULFILLMENT_STATUSES.length];
	return {
		id: `ord_${2e3 + i}`,
		number: `ORD-2025-${String(1e3 + i).padStart(4, "0")}`,
		customerName,
		customerEmail,
		organization: org,
		status,
		paymentStatus,
		fulfillmentStatus,
		currency: "USD",
		items,
		subtotal,
		shipping,
		tax,
		total,
		notes: i % 4 === 0 ? "Rush handling requested." : i % 5 === 0 ? "Waiting on billing confirmation." : "No special instructions.",
		createdAt: `2025-${String(1 + i % 6).padStart(2, "0")}-${String(2 + i * 2 % 27).padStart(2, "0")}`,
		updatedAt: `2025-${String(1 + i % 6).padStart(2, "0")}-${String(3 + i * 3 % 26).padStart(2, "0")}`
	};
});
//#endregion
export { PRODUCTS as n, ROLES as r, ORDERS as t };
