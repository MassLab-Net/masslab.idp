export type AuthUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  organization: string;
  tenantId?: string;
  isSystemAdmin: boolean;
  isTenantAdmin: boolean;
  permissions: string[];
  avatar?: string;
  title: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt: number;
  identityBaseUrl: string;
  organizationSlug?: string;
};
