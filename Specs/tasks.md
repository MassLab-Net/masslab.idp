# Identity/SSO Implementation Tasks

Status legend:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked

## 0. Preparation

- [x] Read `CommonGuides/Common guide.md`.
- [x] Read `Specs/IdentityServer.Requirements.md`.
- [x] Read package guides for API, authentication, authorization, multitenancy, EF Core PostgreSQL, logging, observability, caching, and background jobs as needed.
- [x] Decide solution name, service name, ports, and local development URLs.
- [x] Decide local PostgreSQL connection string and seed admin credentials.
- [x] Create initial implementation plan for project structure.

## 1. Project Scaffold

- [x] Create ASP.NET Core MVC/Razor solution for the Identity/SSO service.
- [x] Add test projects for unit and integration tests.
- [x] Add required MassLab common NuGet packages.
- [x] Add OpenIddict packages.
- [x] Add EF Core PostgreSQL packages.
- [x] Configure appsettings for database, multitenancy, auth, logging, SMTP defaults, and OpenIddict.
- [x] Configure common API middleware: trace ID, exception handling, request logging, security headers, health checks.
- [x] Configure structured logging.
- [x] Add basic health endpoint.

## 2. Domain Model

- [x] Define system-level tenant entity.
- [x] Define tenant domain/subdomain entity.
- [x] Define tenant status and lifecycle fields.
- [x] Define tenant default policy entity.
- [x] Define tenant-owned user entity.
- [x] Define tenant-owned role entity.
- [x] Define tenant-owned permission entity.
- [x] Define user-role relationship.
- [x] Define role-permission relationship.
- [x] Define client/application entity.
- [x] Define client secret storage model.
- [x] Define client redirect URI model.
- [x] Define client allowed scope/flow model.
- [x] Define token/session policy model.
- [x] Define external login provider model.
- [x] Define provider claim mapping model.
- [x] Define user external login link model.
- [x] Define user session model.
- [x] Define audit log model.
- [x] Define tenant SMTP settings model.
- [x] Define MFA/TOTP enrollment fields.

## 3. Database and Persistence

- [x] Create EF Core DbContext.
- [x] Apply tenant query filters for tenant-owned entities.
- [x] Configure system-level entities without tenant query filters.
- [x] Configure entity relationships and indexes.
- [x] Configure unique constraints per tenant where required.
- [x] Configure OpenIddict entity stores.
- [x] Add initial EF Core migration.
- [x] Add database seed for system admin.
- [x] Add database seed for a sample tenant.
- [x] Add database seed for tenant admin.
- [x] Add repository/service layer patterns consistent with MassLab common database guidance.

## 4. Multitenancy

- [x] Configure `MassLab.Common.Multitenancy`.
- [x] Implement subdomain tenant resolver.
- [x] Handle localhost development tenant resolution.
- [x] Load tenant context before authentication-sensitive routes.
- [x] Validate tenant status on every tenant-scoped request.
- [x] Add tenant isolation guard for admin APIs/pages.
- [x] Add tests for tenant resolution.
- [x] Add tests proving tenant data cannot leak across tenants.

## 5. OpenIddict and OIDC/OAuth2

- [x] Configure OpenIddict server.
- [x] Enable authorization endpoint.
- [x] Enable token endpoint.
- [x] Enable revocation endpoint.
- [x] Enable introspection endpoint.
- [x] Enable userinfo endpoint.
- [x] Enable logout endpoint.
- [x] Configure Authorization Code with PKCE.
- [x] Configure Client Credentials flow.
- [x] Configure Refresh Token flow.
- [x] Configure signing/encryption certificates for development.
- [x] Configure production certificate loading.
- [x] Map tenant clients to OpenIddict applications.
- [x] Enforce tenant/client allowed flows.
- [x] Enforce tenant/client redirect URI rules.
- [x] Enforce tenant/client token lifetime policies.
- [x] Add tests for Authorization Code with PKCE.
- [x] Add tests for Client Credentials.
- [x] Add tests for Refresh Token.
- [x] Add tests for token revoke.
- [x] Add tests for token introspection.
- [x] Add tests for userinfo.

## 6. Login and Account UI

- [x] Create tenant-aware login page.
- [x] Create logout confirmation page.
- [x] Create forgot password page.
- [x] Create reset password page.
- [x] Create email verification page.
- [x] Create MFA/TOTP enrollment page.
- [x] Create MFA/TOTP challenge page.
- [x] Show enabled external providers on tenant login page.
- [x] Validate disabled tenant cannot log in.
- [x] Validate disabled user cannot log in.
- [x] Add failed login handling.
- [x] Add lockout/rate-limit behavior if required by security settings.
- [x] Add account UI integration tests.

## 7. Local Users and Passwords

- [x] Implement local user creation.
- [x] Implement secure password hashing.
- [x] Implement password validation policy.
- [x] Implement password change.
- [x] Implement password reset token generation.
- [x] Implement password reset completion.
- [x] Implement email verification token generation.
- [x] Implement email verification completion.
- [x] Implement user status management.
- [x] Add tests for password reset.
- [x] Add tests for email verification.

## 8. MFA/TOTP

- [x] Implement TOTP secret generation.
- [x] Implement authenticator app QR/setup data.
- [x] Implement TOTP verification.
- [x] Implement tenant-level MFA enable/disable policy.
- [x] Implement user-level MFA enrollment state.
- [x] Add tenant admin controls for MFA policy.
- [x] Add tests for MFA enrollment.
- [x] Add tests for MFA login challenge.

## 9. RBAC and Permissions

- [x] Configure `MassLab.Common.Authorization`.
- [x] Define system admin authorization policies.
- [x] Define tenant admin authorization policies.
- [x] Define permission policy naming convention.
- [x] Implement user-role assignment.
- [x] Implement role-permission assignment.
- [x] Implement effective permission calculation.
- [x] Emit relevant permission/scope claims during token issuance.
- [x] Ensure permission changes apply to newly issued tokens.
- [x] Add tests for role assignment.
- [x] Add tests for permission enforcement.
- [x] Add tests for token claims/scopes.

## 10. System Admin Portal

- [x] Create system admin layout/navigation.
- [x] Create tenant list page.
- [x] Create tenant create/edit pages.
- [x] Create tenant enable/disable action.
- [x] Create tenant domain/subdomain management.
- [x] Create default tenant policy management.
- [x] Create high-level tenant health/status page.
- [x] Add authorization guards for system admin pages.
- [x] Add tests for system admin tenant management.

## 11. Tenant Admin Portal

- [x] Create tenant admin layout/navigation.
- [x] Create dashboard page.
- [x] Create user list page.
- [x] Create user create/edit/disable/delete actions.
- [x] Create user role assignment page.
- [x] Create role list page.
- [x] Create role create/edit/delete actions.
- [x] Create role permission assignment page.
- [x] Create permission list page.
- [x] Create client/application list page.
- [x] Create client/application create/edit/disable/delete actions.
- [x] Create client secret generation UI.
- [x] Create redirect URI management UI.
- [x] Create allowed scopes/flows management UI.
- [x] Create token/session policy management UI.
- [x] Create login provider management UI.
- [x] Create SMTP settings UI.
- [x] Create user session list and revoke UI.
- [x] Create audit log list/filter UI.
- [x] Add authorization guards for tenant admin pages.
- [x] Add tests for tenant admin workflows.

## 12. Client/Application Management

- [x] Implement web client configuration.
- [x] Implement SPA client configuration.
- [x] Implement mobile client configuration.
- [x] Implement service client configuration.
- [x] Implement secure client secret generation.
- [x] Implement secure client secret storage.
- [x] Ensure client secrets are only shown once.
- [x] Validate redirect URIs.
- [x] Validate post logout redirect URIs.
- [x] Validate allowed scopes.
- [x] Validate allowed flows.
- [x] Add tests for each client type.
- [x] Add tests for invalid redirect URI rejection.

## 13. External Login Providers

- [x] Implement generic OIDC/OAuth provider configuration.
- [x] Store provider secrets securely.
- [x] Implement provider enable/disable behavior.
- [x] Implement claim mapping.
- [x] Implement external login callback.
- [x] Implement external account linking.
- [x] Implement optional user provisioning from external provider.
- [x] Ensure provider configuration is tenant-scoped.
- [x] Add tests for provider visibility per tenant.
- [x] Add tests for external login callback.

## 14. SMTP and Email

- [x] Implement tenant SMTP configuration storage.
- [x] Protect SMTP password/secret.
- [x] Implement email sender service.
- [x] Implement email verification email.
- [x] Implement password reset email.
- [x] Implement invitation email if invite flow is enabled.
- [x] Add email templates.
- [x] Add tests for tenant SMTP selection.
- [x] Add tests for email request generation.

## 15. Sessions

- [x] Create session records on successful login.
- [x] Update session activity metadata.
- [x] Track IP address and user agent.
- [x] Revoke user session.
- [x] Revoke all sessions for a user.
- [x] Revoke sessions when user is disabled.
- [x] Reflect session revoke in token/session validation.
- [x] Add tests for session list.
- [x] Add tests for session revoke.

## 16. Audit Logs

- [x] Implement audit log writer.
- [x] Capture successful login.
- [x] Capture failed login.
- [x] Capture logout.
- [x] Capture token refresh.
- [x] Capture token revocation.
- [x] Capture session revocation.
- [x] Capture password reset requested/completed.
- [x] Capture email verification completed.
- [x] Capture MFA enrollment and challenge result.
- [x] Capture user admin changes.
- [x] Capture role admin changes.
- [x] Capture permission assignment changes.
- [x] Capture client application changes.
- [x] Capture login provider changes.
- [x] Capture SMTP setting changes.
- [x] Capture tenant changes.
- [x] Add audit log search/filter.
- [x] Add tests for required audit events.

## 17. Security Hardening

- [x] Add rate limiting for login-sensitive endpoints.
- [x] Add rate limiting for token-sensitive endpoints.
- [x] Ensure secrets are never logged.
- [x] Ensure secrets are never returned in normal read APIs/pages.
- [x] Configure secure cookies.
- [x] Configure CSRF protection for MVC forms.
- [x] Configure production HTTPS requirements.
- [x] Configure security headers.
- [x] Review token replay/reuse handling.
- [x] Review tenant boundary enforcement.
- [x] Add negative tests for unauthorized admin access.

## 18. Observability and Operations

- [x] Add structured logs for auth and admin flows.
- [x] Add trace/correlation ID propagation.
- [x] Add health checks for database.
- [x] Add health checks for OpenIddict dependencies if applicable.
- [x] Add metrics for login success/failure.
- [x] Add metrics for token issuance/revocation.
- [x] Add cleanup job for expired tokens/sessions if needed.
- [x] Add cleanup job for stale verification/reset tokens if needed.

## 19. Documentation

- [x] Document local development setup.
- [x] Document database migration commands.
- [x] Document seed credentials.
- [x] Document tenant subdomain setup for local development.
- [x] Document OIDC client setup examples.
- [x] Document external provider setup.
- [x] Document SMTP setup.
- [x] Document admin roles and permissions.
- [x] Document production deployment checklist.

## 20. Final Acceptance

- [x] Run full build.
- [x] Run unit tests.
- [x] Run integration tests.
- [x] Verify system admin can create tenant and subdomain.
- [x] Verify tenant admin can manage users, roles, permissions, clients, providers, sessions, and audit logs.
- [x] Verify tenant isolation across two tenants.
- [x] Verify SSO login for tenant web client.
- [x] Verify Authorization Code with PKCE.
- [x] Verify Client Credentials.
- [x] Verify Refresh Token.
- [x] Verify Revocation.
- [x] Verify Introspection.
- [x] Verify UserInfo.
- [x] Verify email verification.
- [x] Verify password reset.
- [x] Verify optional MFA/TOTP.
- [x] Verify external OIDC/OAuth login provider.
- [x] Verify audit logs for required events.
- [x] Update `Specs/IdentityServer.Requirements.md` if implementation decisions changed approved requirements.
