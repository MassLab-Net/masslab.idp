const configuredIdentityRootUrl = import.meta.env.VITE_IDENTITY_ROOT_URL;
const configuredDefaultTenant = import.meta.env.VITE_IDENTITY_DEFAULT_TENANT?.trim().toLowerCase();

function getDefaultTenantSlug() {
  if (configuredDefaultTenant) {
    return configuredDefaultTenant;
  }

  if (configuredIdentityRootUrl) {
    try {
      const url = new URL(configuredIdentityRootUrl);
      const firstSegment = url.pathname
        .split("/")
        .map((segment) => segment.trim().toLowerCase())
        .find(Boolean);

      if (firstSegment) {
        return firstSegment;
      }
    } catch {
      // Ignore invalid env values and fall back to the repo default.
    }
  }

  return "demo";
}

export const DEFAULT_TENANT_SLUG = getDefaultTenantSlug();
