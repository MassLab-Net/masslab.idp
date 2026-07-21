import type { AuthUser } from "@/lib/auth-types";

type AdminRouteAccess = {
  path: string;
  permission?: string;
  requiresSystemAdmin?: boolean;
};

// Single source of truth for mapping each admin menu/route to its required permission.
// Add a new protected admin feature here before adding its sidebar item or route.
export const adminRouteAccess: readonly AdminRouteAccess[] = [
  { path: "/admin/tenant/organizations", requiresSystemAdmin: true },
  { path: "/admin/access-control/users", permission: "users.manage" },
  { path: "/admin/access-control/roles", permission: "roles.manage" },
  {
    path: "/admin/access-control/permissions",
    permission: "permissions.manage",
  },
  { path: "/admin/access-control/clients", permission: "clients.manage" },
] as const;

export function canAccessAdminPath(
  user: AuthUser | null | undefined,
  path: string,
) {
  const access = [...adminRouteAccess]
    .sort((left, right) => right.path.length - left.path.length)
    .find((item) => path === item.path || path.startsWith(`${item.path}/`));

  if (!access) {
    return true;
  }

  return (
    !!user &&
    (!access.permission || user.permissions.includes(access.permission)) &&
    (!access.requiresSystemAdmin ||
      (user.isSystemAdmin && user.isSystemDefaultTenant))
  );
}

export function canAccessAdminMenu(
  user: AuthUser | null | undefined,
  path: string,
) {
  return canAccessAdminPath(user, path);
}
