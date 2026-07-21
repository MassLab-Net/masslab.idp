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
```
$env:ConnectionStrings__DefaultConnection='Host=ep-orange-hat-azo6phox-pooler.c-3.ap-southeast-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_eZqGmkhQI35L;Ssl Mode=Require;Channel Binding=Require'; dotnet run --project src\MassLab.Identity.Web\MassLab.Identity.Web.csproj
```
To seed the default system tenant and local demo accounts, run the app once with startup seeding enabled:

```bash
# PowerShell
$env:Database__SeedOnStartup="true"
$env:Database__SeedPassword="use-a-secret-password"
dotnet run --project src/MassLab.Identity.Web/MassLab.Identity.Web.csproj
```

The seed creates or updates the default system tenant:

- Tenant name: `Demo Tenant`
- Tenant slug: `demo`
- Host: `demo.localhost`
- `IsSystemDefault = true`

Rules for the default system tenant:

- It cannot be deleted.
- It cannot be disabled.
- Only requests scoped to this tenant can manage Organizations.

Development seed accounts in the default tenant use the configured `Database__SeedPassword` (or the local-only fallback):

- System admin: `system@masslab.local`
- Tenant admin: `admin@demo.local`

After the first seeded startup, disable seeding again:

```bash
Remove-Item Env:Database__SeedOnStartup
```

## Tenant Resolution

Tenants are resolved by subdomain/domain. The default seed creates:

- Tenant slug: `demo`
- Host: `demo.localhost`

For localhost testing without DNS setup, use the tenant path:

- Login/authorize path style: `/demo/connect/authorize`, `/demo/account/login`
- Tenant is never resolved from `?tenant=`. `X-Tenant-Slug` and `X-Tenant-Id` are disabled by default and may only be enabled for trusted internal ingress.

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

- Set `OpenIddict:Issuer` to the public HTTPS issuer URL.
- Set `OpenIddict:KeyMaterial:SigningCertificatePath` and `OpenIddict:KeyMaterial:EncryptionCertificatePath` to mounted PKCS#12 certificates; provide passwords only through secret injection.
- Set `Security:DataProtection:KeyRingPath` to durable storage shared by every Identity instance.
- Set `Database:SeedOnStartup` to `false`.
- Use production PostgreSQL credentials from secret storage.
- Rotate any database credential that was previously committed to source control.
- Configure HTTPS and secure cookie settings.
- Keep `Multitenancy:AllowTenantHeaders=false` unless a trusted internal ingress requires it.
- Keep `OpenIddict:AdminSpaClient:ProvisionOnStartup=false`; provision clients via the tenant creation workflow or a controlled job.
- Configure external provider secrets through secret storage.
- Configure SMTP secrets through secret storage.
- Enable observability/metrics endpoint according to deployment requirements.
- Run full build and test suite before deployment.
