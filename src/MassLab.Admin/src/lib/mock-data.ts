export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: "Starter" | "Business" | "Enterprise";
  members: number;
  status: "Active" | "Suspended";
  createdAt: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // permission ids
  users: number;
  system: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  status: "Active" | "Invited" | "Disabled";
  roles: string[]; // role ids
  directPermissions: string[];
  lastActive: string;
  organization: string;
};

export type Permission = {
  id: string;
  name: string;
  description?: string;
};

export type PermissionModule = {
  id: string;
  name: string;
  permissions: Permission[];
};

export const ORGANIZATIONS: Organization[] = [
  { id: "org_1", name: "Acme Corporation", slug: "acme", plan: "Enterprise", members: 248, status: "Active", createdAt: "2024-02-11" },
  { id: "org_2", name: "Northwind Labs", slug: "northwind", plan: "Business", members: 64, status: "Active", createdAt: "2024-08-03" },
  { id: "org_3", name: "Contoso Bank", slug: "contoso", plan: "Enterprise", members: 1290, status: "Active", createdAt: "2023-05-22" },
  { id: "org_4", name: "Globex Health", slug: "globex", plan: "Business", members: 88, status: "Suspended", createdAt: "2025-01-14" },
  { id: "org_5", name: "Initech Studio", slug: "initech", plan: "Starter", members: 9, status: "Active", createdAt: "2025-09-30" },
];

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: "iam",
    name: "Identity & Access",
    permissions: [
      { id: "iam.users.read", name: "View users" },
      { id: "iam.users.write", name: "Create & edit users" },
      { id: "iam.users.delete", name: "Delete users" },
      { id: "iam.users.invite", name: "Invite users" },
      { id: "iam.roles.read", name: "View roles" },
      { id: "iam.roles.write", name: "Create & edit roles" },
      { id: "iam.roles.delete", name: "Delete roles" },
      { id: "iam.permissions.read", name: "View permissions" },
      { id: "iam.permissions.write", name: "Assign permissions" },
    ],
  },
  {
    id: "org",
    name: "Organization",
    permissions: [
      { id: "org.settings.read", name: "View organization settings" },
      { id: "org.settings.write", name: "Edit organization settings" },
      { id: "org.billing.read", name: "View billing" },
      { id: "org.billing.write", name: "Manage billing" },
      { id: "org.audit.read", name: "View audit logs" },
    ],
  },
  {
    id: "directory",
    name: "Directory & SSO",
    permissions: [
      { id: "directory.sync.read", name: "View directory sync" },
      { id: "directory.sync.write", name: "Configure directory sync" },
      { id: "directory.sso.read", name: "View SSO" },
      { id: "directory.sso.write", name: "Configure SSO providers" },
    ],
  },
  {
    id: "api",
    name: "API & Integrations",
    permissions: [
      { id: "api.tokens.read", name: "View API tokens" },
      { id: "api.tokens.write", name: "Create API tokens" },
      { id: "api.webhooks.read", name: "View webhooks" },
      { id: "api.webhooks.write", name: "Manage webhooks" },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    permissions: [
      { id: "reports.read", name: "View reports" },
      { id: "reports.export", name: "Export reports" },
    ],
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.id));

export const ROLES: Role[] = [
  {
    id: "role_admin",
    name: "Super Administrator",
    description: "Full access to every module across the tenant.",
    permissions: ALL_PERMISSION_IDS,
    users: 4,
    system: true,
  },
  {
    id: "role_org_admin",
    name: "Organization Admin",
    description: "Manage organization, members, and billing.",
    permissions: [
      "iam.users.read","iam.users.write","iam.users.invite","iam.roles.read",
      "org.settings.read","org.settings.write","org.billing.read","org.audit.read",
    ],
    users: 12,
    system: false,
  },
  {
    id: "role_security",
    name: "Security Engineer",
    description: "Audit logs, SSO, and directory sync configuration.",
    permissions: [
      "iam.users.read","iam.roles.read","iam.permissions.read",
      "directory.sync.read","directory.sync.write","directory.sso.read","directory.sso.write",
      "org.audit.read",
    ],
    users: 7,
    system: false,
  },
  {
    id: "role_developer",
    name: "Developer",
    description: "API tokens, webhooks, and read-only directory.",
    permissions: ["api.tokens.read","api.tokens.write","api.webhooks.read","api.webhooks.write","iam.users.read"],
    users: 34,
    system: false,
  },
  {
    id: "role_analyst",
    name: "Analyst",
    description: "Read-only access to reports and analytics.",
    permissions: ["reports.read","reports.export","iam.users.read"],
    users: 18,
    system: false,
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Read-only across IAM screens.",
    permissions: ["iam.users.read","iam.roles.read","iam.permissions.read"],
    users: 92,
    system: true,
  },
];

const FIRST = ["Linh","Minh","Aiden","Sofia","Hai","Ravi","Yuki","Emma","Quan","Noah","Mai","Jonas","Ngoc","Priya","Lucas","Anh","Olivia","Ethan","Trang","Daniel"];
const LAST = ["Nguyen","Tran","Le","Pham","Garcia","Smith","Brown","Kim","Tanaka","Singh","Pereira","Vu","Hoang","Bui","Do","Walker","Chen","Anderson","Cole","Bach"];
const STATUSES: User["status"][] = ["Active","Active","Active","Invited","Disabled","Active"];

function rand<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

export const USERS: User[] = Array.from({ length: 24 }).map((_, i) => {
  const f = rand(FIRST, i * 3 + 1);
  const l = rand(LAST, i * 5 + 2);
  const name = `${f} ${l}`;
  const username = `${f}.${l}`.toLowerCase();
  const roleA = ROLES[(i + 1) % ROLES.length].id;
  const roleB = ROLES[(i + 3) % ROLES.length].id;
  const direct = i % 4 === 0 ? ["org.audit.read"] : i % 5 === 0 ? ["reports.export"] : [];
  return {
    id: `usr_${1000 + i}`,
    name,
    username,
    email: `${username}@masslab.io`,
    status: rand(STATUSES, i),
    roles: i % 3 === 0 ? [roleA, roleB] : [roleA],
    directPermissions: direct,
    lastActive: `${1 + (i % 27)} ${["minutes","hours","days"][i % 3]} ago`,
    organization: ORGANIZATIONS[i % ORGANIZATIONS.length].name,
  };
});

// ── Products ─────────────────────────────────────────────────────────────────
export type ProductStatus = "Active" | "Draft" | "Archived";
export type ProductCategory = "Software" | "Hardware" | "Service" | "Subscription";

export type Product = {
  id: string;
  sku: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  currency: string;
  stock: number;
  tags: string[];
  translations: {
    en: {
      name: string;
      description: string;
    };
    vi: {
      name: string;
      description: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

const PRODUCT_NAMES = [
  "IAM Enterprise Suite", "Identity Gateway", "SSO Connector", "Audit Log Pro",
  "Directory Sync Agent", "API Access Manager", "Role Designer Studio", "MFA Hardware Token",
  "Security Dashboard", "Compliance Reporter", "Webhook Relay", "SCIM Provisioner",
  "OAuth2 Toolkit", "Zero Trust Module", "Biometric Auth Kit", "Admin Console License",
  "Developer SDK", "Multi-Tenant Platform", "Access Policy Engine", "Session Manager Pro",
];

const CATEGORIES: ProductCategory[] = ["Software", "Software", "Service", "Hardware", "Subscription", "Software"];
const STATUSES_P: ProductStatus[] = ["Active", "Active", "Active", "Draft", "Archived", "Active"];
const PRICES = [49, 99, 149, 199, 299, 399, 499, 799, 999, 1299, 1999, 2499];
const TAGS_POOL = ["iam", "sso", "rbac", "audit", "compliance", "api", "mfa", "security", "enterprise", "cloud"];

export const PRODUCTS: Product[] = Array.from({ length: 20 }).map((_, i) => {
  const price = PRICES[i % PRICES.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const status = STATUSES_P[i % STATUSES_P.length];
  return {
    id: `prod_${1000 + i}`,
    sku: `ML-${(1000 + i * 7).toString().padStart(5, "0")}`,
    category,
    status,
    price,
    currency: "USD",
    stock: status === "Archived" ? 0 : 10 + (i * 13) % 490,
    tags: [TAGS_POOL[i % TAGS_POOL.length], TAGS_POOL[(i + 3) % TAGS_POOL.length]],
    translations: {
      en: {
        name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
        description: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} provides enterprise-grade identity and access management capabilities for modern organizations.`,
      },
      vi: {
        name: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} (VI)`,
        description: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} cung cấp các năng lực quản lý định danh và truy cập ở cấp doanh nghiệp cho tổ chức hiện đại.`,
      },
    },
    createdAt: `2024-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i * 3) % 28).padStart(2, "0")}`,
    updatedAt: `2025-${String(1 + (i % 6)).padStart(2, "0")}-${String(1 + (i * 5) % 28).padStart(2, "0")}`,
  };
});

// ── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";
export type FulfillmentStatus = "Unfulfilled" | "Partial" | "Fulfilled";

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  organization: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

const ORDER_CUSTOMERS = [
  ["Elena", "Nguyen"], ["Marcus", "Chen"], ["Priya", "Sharma"], ["Daniel", "Walker"],
  ["Linh", "Tran"], ["Aiden", "Smith"], ["Sofia", "Garcia"], ["Hai", "Le"],
  ["Olivia", "Brown"], ["Noah", "Kim"], ["Mai", "Pham"], ["Yuki", "Tanaka"],
];

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded", "Processing", "Shipped"];
const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Paid", "Paid", "Paid", "Refunded", "Failed", "Paid", "Paid"];
const FULFILLMENT_STATUSES: FulfillmentStatus[] = ["Unfulfilled", "Partial", "Partial", "Fulfilled", "Unfulfilled", "Unfulfilled", "Partial", "Fulfilled"];

export const ORDERS: Order[] = Array.from({ length: 18 }).map((_, i) => {
  const [first, last] = ORDER_CUSTOMERS[i % ORDER_CUSTOMERS.length];
  const customerName = `${first} ${last}`;
  const customerEmail = `${first}.${last}`.toLowerCase() + "@masslab.io";
  const org = ORGANIZATIONS[i % ORGANIZATIONS.length].name;
  const productA = PRODUCTS[(i * 2) % PRODUCTS.length];
  const productB = PRODUCTS[(i * 2 + 3) % PRODUCTS.length];
  const items: OrderItem[] = [
    { productId: productA.id, name: productA.translations.en.name, qty: 1 + (i % 3), price: productA.price },
  ];
  if (i % 2 === 0) {
    items.push({ productId: productB.id, name: productB.translations.en.name, qty: 1, price: productB.price });
  }
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping = subtotal >= 500 ? 0 : 19.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
  const paymentStatus = PAYMENT_STATUSES[i % PAYMENT_STATUSES.length];
  const fulfillmentStatus = FULFILLMENT_STATUSES[i % FULFILLMENT_STATUSES.length];
  return {
    id: `ord_${2000 + i}`,
    number: `ORD-2025-${String(1000 + i).padStart(4, "0")}`,
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
    createdAt: `2025-${String(1 + (i % 6)).padStart(2, "0")}-${String(2 + (i * 2) % 27).padStart(2, "0")}`,
    updatedAt: `2025-${String(1 + (i % 6)).padStart(2, "0")}-${String(3 + (i * 3) % 26).padStart(2, "0")}`,
  };
});
