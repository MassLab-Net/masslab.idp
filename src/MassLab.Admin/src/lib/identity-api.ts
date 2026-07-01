import type { AuthSession } from "@/lib/auth-types";

export type AdminAuditLogDto = {
  id: string;
  createdAt: string;
  eventType: string;
  result: string;
  succeeded: boolean;
  actorType: string;
  actorUserId?: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  traceId?: string;
};

export type TenantUserDto = {
  id: string;
  email?: string;
  displayName: string;
  isEnabled: boolean;
  isSystemAdmin: boolean;
  isTenantAdmin: boolean;
};

export type TenantRoleDto = {
  id: string;
  name: string;
  description: string;
};

export type TenantPermissionDto = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export type ClientApplicationDto = {
  id: string;
  name: string;
  clientId: string;
  type: string;
  enabled: boolean;
  allowedFlows: string;
  allowedScopes: string;
  redirectUris: string[];
};

export type ExternalLoginProviderDto = {
  id: string;
  displayName: string;
  authority: string;
  clientId: string;
  scopes: string;
  enabled: boolean;
  autoProvisionUsers: boolean;
};

export type UserSessionDto = {
  id: string;
  userId: string;
  userEmail?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  lastSeenAt: string;
  revokedAt?: string;
  isActive: boolean;
};

export type SystemTenantDto = {
  id: string;
  name: string;
  slug: string;
  status: string;
  isActive: boolean;
  primaryHostName?: string;
};

export type TenantAdminDashboardDto = {
  users: number;
  roles: number;
  permissions: number;
  clients: number;
  providers: number;
  sessions: number;
  recentAuditLogs: AdminAuditLogDto[];
};

export type TenantUsersDto = {
  users: TenantUserDto[];
  roles: TenantRoleDto[];
  assignedRoleIds: Record<string, string[]>;
};

export type TenantRolesDto = {
  roles: TenantRoleDto[];
  permissions: TenantPermissionDto[];
  assignedPermissionIds: Record<string, string[]>;
};

export type CommandResult = {
  succeeded: boolean;
  notFound?: boolean;
  errors?: string[];
};

export type CreateClientResult = CommandResult & {
  clientId?: string;
  clientSecret?: string;
};

export async function identityFetch<T>(session: AuthSession, path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(new URL(path, session.identityBaseUrl), {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your admin session is no longer authorized.");
  }

  if (!response.ok) {
    const payload = await tryReadJson(response);
    throw new Error(payload?.errors?.[0] ?? payload?.title ?? payload?.error_description ?? "Identity API request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function tryReadJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
