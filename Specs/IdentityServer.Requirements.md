# Identity/SSO System Requirements

## 1. Objective

Build a multi-tenant Identity Provider similar to Keycloak using ASP.NET Core MVC and OpenIddict.

The system must provide:

- SSO login screens for web applications.
- Standards-based OpenID Connect/OAuth2 APIs for web, SPA, mobile, and service clients.
- Tenant-isolated administration of users, roles, permissions, applications, login providers, token policies, and sessions.
- System-level administration for tenant lifecycle and global defaults.

This document is the source requirement for AI/engineer implementation.

## 2. Technology Requirements

Use the MassLab common packages from NuGet. Do not copy common package source code into this service.

Before implementation, read `CommonGuides/Common guide.md` and the package-specific guides needed for the service.

Required common packages:

- `MassLab.Common.Api`
- `MassLab.Common.Authentication`
- `MassLab.Common.Authorization`
- `MassLab.Common.Multitenancy`
- `MassLab.Common.Database`
- `MassLab.Common.Database.EFCore`
- `MassLab.Common.Database.EFCore.PostgreSQL`

Likely supporting packages:

- `MassLab.Common.Logging` or `MassLab.Common.Logging.Serilog`
- `MassLab.Common.Observability`
- `MassLab.Common.Caching` with Redis or Memory provider
- `MassLab.Common.BackgroundJobs` if email delivery or token/session cleanup needs background processing

Core stack:

- .NET 10 target framework, because the required MassLab common packages currently target `net10.0`.
- ASP.NET Core MVC/Razor for login and admin UI.
- OpenIddict for OpenID Connect/OAuth2 authorization server behavior.
- EF Core with PostgreSQL.
- Shared database with tenant isolation by `TenantId`.

## 3. Multi-Tenancy

The service must use a shared database model with `TenantId` on tenant-owned data.

Tenant resolution:

- Primary tenant resolution is by subdomain.
- Example: `tenant-a.idp.domain.com`.
- Public SSO, admin portal, and OIDC callbacks must operate in the context of the resolved tenant.

System-level data:

- Tenants.
- Tenant domains/subdomains.
- Tenant status.
- Global/default policy templates.

Tenant-owned data:

- Users.
- Roles.
- Permissions.
- Client applications.
- Login provider configuration.
- Token/session policies.
- User sessions.
- Audit logs.
- SMTP settings.

Tenant isolation requirements:

- A tenant admin must not be able to view, create, update, or delete data belonging to another tenant.
- Tenant-owned queries must consistently filter by the active tenant context.
- Cross-tenant operations are allowed only for system admin features.

## 4. OpenID Connect and OAuth2 Requirements

Use OpenIddict to expose standards-based endpoints.

Required endpoints:

- `/connect/authorize`
- `/connect/token`
- `/connect/revocation`
- `/connect/introspect`
- `/connect/userinfo`
- `/connect/logout`

Required client/application types:

- Web server applications.
- SPA applications.
- Mobile applications.
- Service-to-service/API clients.

Required flows:

- Authorization Code with PKCE for web, SPA, and mobile clients.
- Client Credentials for service-to-service clients.
- Refresh Token flow when enabled by tenant/client policy.

Out of scope for v1 unless explicitly added later:

- Implicit flow.
- Resource Owner Password Credentials flow as the default login path.
- SAML.
- LDAP/user federation.
- Full Keycloak-style authorization policy engine.

## 5. Login and Account Requirements

The login experience must support SSO for tenant applications.

Required screens/pages:

- Login.
- Logout confirmation when needed.
- Forgot password.
- Reset password.
- Email verification.
- MFA/TOTP enrollment.
- MFA/TOTP challenge.
- External login provider callback handling.

Account behavior:

- Users can authenticate with local username/email and password.
- Email verification must be supported.
- Password reset must be supported.
- MFA via TOTP is optional and can be enabled by tenant policy and/or user enrollment.
- Login must respect tenant status and user status.

The default app login integration should use OIDC/OAuth2 standards. Do not design a custom username/password login API as the main path unless a later requirement explicitly asks for it.

## 6. Token, Session, and Verification Requirements

The system must support token lifecycle management.

Required behavior:

- Issue access tokens according to client and tenant policy.
- Issue refresh tokens only when allowed by tenant/client policy.
- Refresh access tokens through the standard token endpoint.
- Revoke access tokens or refresh tokens through the revocation endpoint.
- Verify token activity through the introspection endpoint.
- Return user profile/claims through the userinfo endpoint.
- Support logout and session termination.

Policy levels:

- Tenant-level default token/session policy.
- Client/application-level override policy.

Configurable policy values should include at minimum:

- Access token lifetime.
- Refresh token lifetime.
- Refresh token enable/disable.
- Allowed OAuth/OIDC flows.
- Redirect URIs.
- Post logout redirect URIs.
- Consent requirement when applicable.

Session management:

- Track active user sessions by tenant.
- Allow tenant admin to view and revoke user sessions within their tenant.
- Allow system admin to inspect tenant-level session status when needed.

## 7. User, Role, and Permission Requirements

Use RBAC with permissions.

Tenant admin capabilities:

- Create, update, disable, and delete users.
- Invite users if email delivery is configured.
- Assign and remove roles from users.
- Create, update, and delete roles.
- Assign and remove permissions from roles.
- View effective permissions for a user.

Permission model:

- Permissions are tenant-scoped.
- Roles are tenant-scoped.
- Users are tenant-scoped.
- A role can contain many permissions.
- A user can have many roles.

Authorization behavior:

- APIs and admin UI must use permission/scope policies.
- Tokens should include claims/scopes needed by clients, based on the authenticated user, client, and tenant policy.
- Permission changes should affect newly issued tokens. Existing token behavior follows the configured token validity and revocation policy.

## 8. Client Application Management

Tenant admins must be able to manage applications/clients for their own tenant.

Client configuration should include:

- Client name.
- Client identifier.
- Client secret for confidential clients.
- Client type: web, SPA, mobile, service.
- Allowed grant/flow types.
- Redirect URIs.
- Post logout redirect URIs.
- Allowed scopes.
- Token/session policy overrides.
- Enabled/disabled status.

Security expectations:

- Client secrets must be stored securely and never displayed in plaintext after creation.
- SPA and mobile clients should use PKCE.
- Service clients should use client credentials.

## 9. External Login Providers

Each tenant can enable and configure its own login providers.

Provider type for v1:

- Generic OIDC/OAuth2 provider.

Provider configuration should include:

- Display name.
- Authority or metadata URL.
- Client ID.
- Client secret.
- Scopes.
- Enabled/disabled status.
- Claim mapping for user identifier, email, display name, and roles if available.

Behavior:

- Tenant admin can create, update, enable, disable, and delete provider configurations.
- Login page should show only enabled providers for the current tenant.
- External login must link to an existing user or create/provision a user according to tenant policy.

Out of scope for v1 unless explicitly added later:

- SAML providers.
- LDAP providers.
- Advanced identity brokering rules.

## 10. Email and SMTP Requirements

Email delivery must support tenant-level SMTP configuration.

Tenant SMTP settings should include:

- Host.
- Port.
- Username.
- Password or secret reference.
- TLS/SSL setting.
- From email.
- From display name.

Required email use cases:

- Email verification.
- Password reset.
- User invitation if enabled.

Secrets must not be displayed in plaintext after save.

## 11. Administration Requirements

### 11.1 System Admin

System admin can:

- Create and manage tenants.
- Configure tenant subdomains/domains.
- Enable or disable tenants.
- Set default tenant policies.
- View high-level tenant health/status.
- Manage system-level settings if needed.

### 11.2 Tenant Admin

Tenant admin can manage only their own tenant.

Tenant admin can:

- Manage users.
- Manage roles.
- Manage permissions.
- Manage applications/clients.
- Manage OIDC/OAuth external login providers.
- Manage SMTP settings.
- Manage token/session policies.
- View and revoke user sessions.
- View audit logs.

## 12. Audit Requirements

The system must record audit logs for security-sensitive and admin actions.

Required audit events:

- Successful login.
- Failed login.
- Logout.
- Token refresh.
- Token revocation.
- Session revocation.
- Password reset requested.
- Password reset completed.
- Email verification completed.
- MFA enrollment.
- MFA challenge success/failure.
- User created/updated/disabled/deleted.
- Role created/updated/deleted.
- Permission assignment changed.
- Client application created/updated/deleted.
- Login provider configuration created/updated/deleted/enabled/disabled.
- SMTP settings changed.
- Tenant created/updated/enabled/disabled.

Audit log fields should include:

- Tenant ID when applicable.
- Actor user ID when applicable.
- Actor type: system admin, tenant admin, user, client.
- Event type.
- Target entity type and ID.
- Timestamp.
- IP address when available.
- User agent when available.
- Trace/correlation ID when available.
- Result: success or failure.

## 13. Security Requirements

Security rules:

- Passwords must be hashed using ASP.NET Core Identity-compatible secure hashing or an equivalent modern password hasher.
- Client secrets and provider secrets must be protected at rest.
- Tenant boundaries must be enforced server-side, not only in UI.
- Admin APIs and pages must require authorization policies.
- Login and token endpoints should be rate-limitable.
- Failed login attempts should be auditable.
- Refresh token reuse/replay should be handled according to OpenIddict best practices.
- Security headers, exception handling, trace ID, and consistent responses should follow `MassLab.Common.Api`.

## 14. Acceptance Tests

Implementation is acceptable when these scenarios pass:

- A system admin can create a tenant and assign a subdomain.
- A tenant admin can log in to that tenant admin portal.
- A tenant admin cannot access another tenant's users, roles, clients, providers, sessions, or audit logs.
- A tenant admin can create users, roles, and permissions.
- A user can log in through the tenant SSO page.
- A web/SPA/mobile client can complete Authorization Code with PKCE.
- A service client can obtain a token using Client Credentials.
- A refresh token can be used when enabled and rejected when disabled.
- A revoked token or refresh token is no longer active.
- Token introspection returns active/inactive status correctly.
- Userinfo returns claims for the authenticated user.
- Email verification works using the tenant SMTP configuration.
- Password reset works using the tenant SMTP configuration.
- A tenant can enable a generic OIDC/OAuth provider and log in through it.
- Tenant-specific provider configuration does not affect other tenants.
- MFA/TOTP can be enabled and used for a user.
- Tenant admin can view and revoke active sessions in their tenant.
- Audit logs are created for login, failed login, revoke token, and admin configuration changes.

## 15. Implementation Defaults

Use these defaults unless a later spec overrides them:

- Tenant model: shared PostgreSQL database with `TenantId`.
- Tenant resolution: subdomain.
- UI: ASP.NET Core MVC/Razor.
- OIDC implementation: OpenIddict.
- Main app login integration: OIDC/OAuth2 standards.
- External login providers: generic OIDC/OAuth2.
- Authorization model: RBAC plus permissions.
- MFA: optional TOTP.
- Email delivery: SMTP configuration per tenant.
- Admin model: system admin plus tenant admin.
- Enterprise features in v1: audit logs and session management.
- Excluded from v1: SAML, LDAP federation, and full Keycloak-style policy engine.
