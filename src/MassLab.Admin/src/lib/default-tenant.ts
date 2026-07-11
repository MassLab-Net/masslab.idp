const configuredDefaultTenant = import.meta.env.VITE_IDENTITY_DEFAULT_TENANT?.trim().toLowerCase();

export const DEFAULT_TENANT_SLUG = configuredDefaultTenant || undefined;
