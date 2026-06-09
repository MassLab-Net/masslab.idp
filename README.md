# MassLab Identity

Multi-tenant Identity/SSO service for MassLab using ASP.NET Core MVC, OpenIddict, EF Core, PostgreSQL, and MassLab common packages.

## Local Development

Prerequisites:

- .NET SDK 10
- PostgreSQL

Default connection string:

```json
"Host=localhost;Port=5432;Database=masslab_identity;Username=postgres;Password=postgres"
```

For remote or production databases, set the connection string through an environment variable instead of committing secrets:

```bash
export MASSLAB_IDP_CONNECTION='Host=...;Port=5432;Database=...;Username=...;Password=...;SearchPath=masslab_idp'
```

Run:

```bash
dotnet restore MassLab.Identity.sln
dotnet ef database update --project src/MassLab.Identity.Web/MassLab.Identity.Web.csproj --startup-project src/MassLab.Identity.Web/MassLab.Identity.Web.csproj
dotnet run --project src/MassLab.Identity.Web/MassLab.Identity.Web.csproj
```

To seed demo data, set:

```json
"Database": {
  "SeedOnStartup": true
}
```

Seed credentials:

- System admin: `system@masslab.local` / `MassLab@12345`
- Tenant admin: `admin@demo.local` / `MassLab@12345`

## Tenant Resolution

Tenants are resolved by subdomain/domain. The demo seed creates:

- Tenant slug: `demo`
- Host: `demo.localhost`

For localhost testing without DNS setup, pass `?tenant=demo`.

## OIDC Client Example

Demo web client:

- Client ID: `demo-web`
- Client secret: `demo-secret`
- Redirect URI: `https://localhost:5003/signin-oidc`
- Post logout redirect URI: `https://localhost:5003/signout-callback-oidc`
- Scopes: `openid profile email`
- Flows: authorization code + refresh token

OpenIddict endpoints:

- `/connect/authorize`
- `/connect/token`
- `/connect/revocation`
- `/connect/introspect`
- `/connect/userinfo`
- `/connect/logout`

## External Providers

Tenant admins can configure generic OIDC/OAuth providers with:

- Display name
- Authority/metadata URL
- Client ID
- Client secret
- Scopes
- Claim mappings
- Auto-provisioning flag

Provider secrets are hashed/protected and are not returned in plaintext.

## SMTP

Tenant SMTP settings include host, port, username, protected password, TLS flag, from email, and from display name.

Email use cases:

- Email verification
- Password reset
- User invitation placeholder

## Admin Roles and Permissions

System admin can manage tenants and tenant domains.

Tenant admin can manage:

- Users
- Roles
- Permissions
- Clients
- Login providers
- SMTP settings
- Sessions
- Audit logs

Permission policies use the format:

```text
permission:{permission-name}
```

Examples:

- `permission:users.manage`
- `permission:clients.manage`
- `permission:audit.read`

## Production Checklist

- Replace development signing/encryption certificates with production certificates.
- Set `Database:SeedOnStartup` to `false`.
- Use production PostgreSQL credentials from secret storage.
- Configure HTTPS and secure cookie settings.
- Configure external provider secrets through secret storage.
- Configure SMTP secrets through secret storage.
- Enable observability/metrics endpoint according to deployment requirements.
- Run full build and test suite before deployment.
