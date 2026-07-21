# Seed accounts

The one-time reset is started with `Database__ResetAndSeedOnStartup=true`. It clears Identity data in the configured database without dropping the database itself, runs migrations, and creates only the records below.

All seeded users use `MassLab@12345` by default. In a non-Development environment set `Database__SeedPassword` to a secret value before running the reset.

| Tenant | Default | Role | User | Password | Access |
| --- | --- | --- | --- | --- | --- |
| `system` | Yes | `SupperAdmin` | `admin@system.local` | `MassLab@12345` | System administrator; all platform permissions |
| `system` | Yes | `SystemMember` | `user@system.local` | `MassLab@12345` | `audit.read` only |
| `demo` | No | `OrgAdmin` | `admin@demo.local` | `MassLab@12345` | All demo tenant management permissions |
| `demo` | No | `OrgMember` | `user@demo.local` | `MassLab@12345` | `audit.read` only |

`system` has all seed permissions, including `tenants.manage`. `demo` has all tenant-management permissions except `tenants.manage`.

After a successful reset, remove the `Database__ResetAndSeedOnStartup` environment variable before starting the application normally.
