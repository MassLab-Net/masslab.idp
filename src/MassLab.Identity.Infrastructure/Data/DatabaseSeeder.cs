using System.Text.Json;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure.Data;

public static class DatabaseSeeder
{
    private const string DefaultSeedPassword = "MassLab@12345";

    private static readonly SeedPermissionDefinition[] SystemPermissions =
    [
        new("tenants.manage", "platform.tenants", "Manage tenant lifecycle and tenant settings"),
        new("users.manage", "access.users", "Manage tenant users"),
        new("roles.manage", "access.roles", "Manage tenant roles"),
        new("permissions.manage", "access.permissions", "Manage tenant permissions"),
        new("clients.manage", "integrations.clients", "Manage client applications"),
        new("providers.manage", "integrations.providers", "Manage external login providers"),
        new("smtp.manage", "settings.notifications.smtp", "Manage SMTP configuration"),
        new("sessions.manage", "security.sessions", "Manage user sessions"),
        new("audit.read", "security.audit", "View audit logs")
    ];

    private static readonly string[] DemoPermissionNames =
    [
        "users.manage", "roles.manage", "permissions.manage", "clients.manage",
        "providers.manage", "smtp.manage", "sessions.manage", "audit.read"
    ];

    public static async Task ResetAndSeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await db.Database.MigrateAsync(cancellationToken);
        await db.Database.ExecuteSqlRawAsync(
            """
            TRUNCATE TABLE
                "Tenants", "AspNetUsers", "AspNetRoles", "TenantRoles", "TenantPermissions",
                "ClientApplications", "ExternalLoginProviders", "TenantSmtpSettings", "AuditLogs",
                "OutboxMessages", "OpenIddictApplications", "OpenIddictScopes"
            RESTART IDENTITY CASCADE;
            """,
            cancellationToken);
        await SeedAsync(scope.ServiceProvider, cancellationToken, migrateDatabase: false);
    }

    public static Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
        => SeedAsync(services, cancellationToken, migrateDatabase: true);

    private static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken, bool migrateDatabase)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var applicationManager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();
        var formatter = scope.ServiceProvider.GetRequiredService<TenantClientIdFormatter>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var environment = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
        var password = GetSeedPassword(configuration, environment);

        if (migrateDatabase)
        {
            await db.Database.MigrateAsync(cancellationToken);
        }

        var systemTenant = await EnsureTenantAsync(db, "System", "system", true, cancellationToken);
        var demoTenant = await EnsureTenantAsync(db, "Demo", "demo", false, cancellationToken);

        var systemPermissionIds = await EnsurePermissionsAsync(db, systemTenant.Id, SystemPermissions, cancellationToken);
        var demoPermissionIds = await EnsurePermissionsAsync(
            db,
            demoTenant.Id,
            SystemPermissions.Where(x => DemoPermissionNames.Contains(x.Name, StringComparer.Ordinal)).ToArray(),
            cancellationToken);

        var supperAdmin = await EnsureRoleAsync(db, systemTenant.Id, "SupperAdmin", "Full platform administration", cancellationToken);
        var systemMember = await EnsureRoleAsync(db, systemTenant.Id, "SystemMember", "Read-only system member", cancellationToken);
        var orgAdmin = await EnsureRoleAsync(db, demoTenant.Id, "OrgAdmin", "Full organization administration", cancellationToken);
        var orgMember = await EnsureRoleAsync(db, demoTenant.Id, "OrgMember", "Standard organization member", cancellationToken);

        await SetRolePermissionsAsync(db, systemTenant.Id, supperAdmin.Id, systemPermissionIds.Values, cancellationToken);
        await SetRolePermissionsAsync(db, systemTenant.Id, systemMember.Id, [systemPermissionIds["audit.read"]], cancellationToken);
        await SetRolePermissionsAsync(db, demoTenant.Id, orgAdmin.Id, demoPermissionIds.Values, cancellationToken);
        await SetRolePermissionsAsync(db, demoTenant.Id, orgMember.Id, [demoPermissionIds["audit.read"]], cancellationToken);

        var systemAdmin = await EnsureUserAsync(userManager, systemTenant.Id, "admin@system.local", "System Administrator", true, false, password);
        var systemUser = await EnsureUserAsync(userManager, systemTenant.Id, "user@system.local", "System User", false, false, password);
        var demoAdmin = await EnsureUserAsync(userManager, demoTenant.Id, "admin@demo.local", "Demo Organization Administrator", false, true, password);
        var demoUser = await EnsureUserAsync(userManager, demoTenant.Id, "user@demo.local", "Demo Organization User", false, false, password);

        await SetUserRolesAsync(db, systemTenant.Id, systemAdmin.Id, [supperAdmin.Id], cancellationToken);
        await SetUserRolesAsync(db, systemTenant.Id, systemUser.Id, [systemMember.Id], cancellationToken);
        await SetUserRolesAsync(db, demoTenant.Id, demoAdmin.Id, [orgAdmin.Id], cancellationToken);
        await SetUserRolesAsync(db, demoTenant.Id, demoUser.Id, [orgMember.Id], cancellationToken);

        await EnsureDemoWebClientAsync(applicationManager, formatter, demoTenant.Id, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static string GetSeedPassword(IConfiguration configuration, IHostEnvironment environment)
    {
        var password = configuration["Database:SeedPassword"];
        if (string.IsNullOrWhiteSpace(password) && !environment.IsDevelopment())
        {
            throw new InvalidOperationException("Database:SeedPassword must be supplied from secret injection when seeding outside Development.");
        }

        return password ?? DefaultSeedPassword;
    }

    private static async Task<Tenant> EnsureTenantAsync(ApplicationDbContext db, string name, string slug, bool isSystemDefault, CancellationToken cancellationToken)
    {
        var tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);
        if (tenant is null)
        {
            tenant = new Tenant { Name = name, Slug = slug, IsSystemDefault = isSystemDefault, Status = TenantStatus.Active };
            db.Tenants.Add(tenant);
            await db.SaveChangesAsync(cancellationToken);
            db.TenantDomains.Add(new TenantDomain { TenantId = tenant.Id, HostName = $"{slug}.localhost", IsPrimary = true });
            db.TenantDefaultPolicies.Add(new TenantDefaultPolicy { TenantId = tenant.Id, RefreshTokensEnabled = true });
        }

        return tenant;
    }

    private static async Task<Dictionary<string, Guid>> EnsurePermissionsAsync(ApplicationDbContext db, Guid tenantId, IReadOnlyCollection<SeedPermissionDefinition> definitions, CancellationToken cancellationToken)
    {
        var existing = await db.TenantPermissions.IgnoreQueryFilters()
            .Where(x => x.TenantId == tenantId)
            .ToDictionaryAsync(x => x.Name, cancellationToken);

        foreach (var definition in definitions)
        {
            if (!existing.TryGetValue(definition.Name, out var permission))
            {
                permission = new TenantPermission { TenantId = tenantId, Name = definition.Name, Category = definition.Category, Description = definition.Description };
                db.TenantPermissions.Add(permission);
                existing.Add(permission.Name, permission);
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        return existing.ToDictionary(x => x.Key, x => x.Value.Id, StringComparer.Ordinal);
    }

    private static async Task<TenantRole> EnsureRoleAsync(ApplicationDbContext db, Guid tenantId, string name, string description, CancellationToken cancellationToken)
    {
        var role = await db.TenantRoles.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Name == name, cancellationToken);
        if (role is not null)
        {
            return role;
        }

        role = new TenantRole { TenantId = tenantId, Name = name, Description = description };
        db.TenantRoles.Add(role);
        await db.SaveChangesAsync(cancellationToken);
        return role;
    }

    private static async Task SetRolePermissionsAsync(ApplicationDbContext db, Guid tenantId, Guid roleId, IEnumerable<Guid> permissionIds, CancellationToken cancellationToken)
    {
        var existing = await db.RolePermissionAssignments.IgnoreQueryFilters().Where(x => x.RoleId == roleId).ToListAsync(cancellationToken);
        db.RolePermissionAssignments.RemoveRange(existing);
        db.RolePermissionAssignments.AddRange(permissionIds.Distinct().Select(permissionId => new RolePermissionAssignment { TenantId = tenantId, RoleId = roleId, PermissionId = permissionId }));
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task<ApplicationUser> EnsureUserAsync(UserManager<ApplicationUser> userManager, Guid tenantId, string email, string displayName, bool isSystemAdmin, bool isTenantAdmin, string password)
    {
        var user = await userManager.Users.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Email == email);
        if (user is null)
        {
            user = new ApplicationUser { TenantId = tenantId, UserName = email, Email = email, EmailConfirmed = true, DisplayName = displayName, IsSystemAdmin = isSystemAdmin, IsTenantAdmin = isTenantAdmin, IsBootstrapUser = true };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join("; ", result.Errors.Select(x => x.Description)));
            }
        }

        return user;
    }

    private static async Task SetUserRolesAsync(ApplicationDbContext db, Guid tenantId, Guid userId, IEnumerable<Guid> roleIds, CancellationToken cancellationToken)
    {
        var existing = await db.UserRoleAssignments.IgnoreQueryFilters().Where(x => x.UserId == userId).ToListAsync(cancellationToken);
        db.UserRoleAssignments.RemoveRange(existing);
        db.UserRoleAssignments.AddRange(roleIds.Distinct().Select(roleId => new UserRoleAssignment { TenantId = tenantId, UserId = userId, RoleId = roleId }));
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureDemoWebClientAsync(IOpenIddictApplicationManager applicationManager, TenantClientIdFormatter formatter, Guid tenantId, CancellationToken cancellationToken)
    {
        var logicalClientId = formatter.NormalizeLogicalClientId("demo-web");
        var clientId = formatter.FormatPhysicalClientId(tenantId, logicalClientId);
        if (await applicationManager.FindByClientIdAsync(clientId, cancellationToken) is not null)
        {
            return;
        }

        var descriptor = new OpenIddictApplicationDescriptor { ClientId = clientId, ClientSecret = "demo-secret", DisplayName = "Demo Web", ClientType = ClientTypes.Confidential, ConsentType = ConsentTypes.Implicit };
        descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(tenantId);
        descriptor.Properties[TenantClientIdFormatter.LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(logicalClientId);
        descriptor.Properties["Type"] = JsonSerializer.SerializeToElement(ClientType.Web.ToString());
        descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(true);
        descriptor.RedirectUris.Add(new Uri("https://localhost:5003/signin-oidc"));
        descriptor.PostLogoutRedirectUris.Add(new Uri("https://localhost:5003/signout-callback-oidc"));
        descriptor.Permissions.UnionWith([
            Permissions.GrantTypes.AuthorizationCode, Permissions.GrantTypes.RefreshToken, Permissions.ResponseTypes.Code,
            Permissions.Endpoints.Authorization, Permissions.Endpoints.Token, Permissions.Endpoints.Revocation, Permissions.Endpoints.Introspection,
            $"{Permissions.Prefixes.Scope}{Scopes.OpenId}", $"{Permissions.Prefixes.Scope}{Scopes.Profile}", $"{Permissions.Prefixes.Scope}{Scopes.Email}"
        ]);
        await applicationManager.CreateAsync(descriptor, cancellationToken);
    }

    private sealed record SeedPermissionDefinition(string Name, string Category, string Description);
}
