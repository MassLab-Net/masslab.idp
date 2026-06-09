# AI Implementation Prompt

You are implementing a multi-tenant Identity/SSO system for MassLab.

Read these files first:

1. `CommonGuides/Common guide.md`
2. `Specs/IdentityServer.Requirements.md`
3. Package-specific guides in `CommonGuides/` for any MassLab common packages you use.

Important rules:

- Use MassLab common packages from NuGet. Do not copy common package source into the service.
- Build with ASP.NET Core MVC/Razor, OpenIddict, EF Core, and PostgreSQL.
- Use shared database multi-tenancy with `TenantId`.
- Resolve tenants primarily by subdomain.
- Implement OIDC/OAuth2 standard endpoints and flows through OpenIddict.
- Provide Web Admin Portal features for system admin and tenant admin.
- Enforce tenant isolation on the server side for all tenant-owned data.
- Include focused tests for tenant isolation, token lifecycle, admin permissions, and login flows.

Deliverables expected from implementation:

- A runnable ASP.NET Core Identity/SSO service.
- EF Core entities, DbContext, and migrations for tenants, users, roles, permissions, clients, login providers, sessions, audit logs, SMTP settings, and policies.
- OpenIddict configuration for authorize, token, revocation, introspection, userinfo, and logout.
- MVC/Razor login/account pages and admin portal pages.
- Tenant-aware authorization and data filtering.
- Automated tests covering the acceptance scenarios in `Specs/IdentityServer.Requirements.md`.

