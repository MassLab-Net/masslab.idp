using System.Text.Json;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure.Data;

public static class DatabaseSeeder
{
    private static readonly SeedPermissionDefinition[] SeedPermissions =
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

    public static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var secretService = scope.ServiceProvider.GetRequiredService<ISecretService>();
        var applicationManager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();
        var formatter = scope.ServiceProvider.GetRequiredService<TenantClientIdFormatter>();

        await db.Database.MigrateAsync(cancellationToken);

        var tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == "demo", cancellationToken);
        if (tenant is null)
        {
            tenant = new Tenant { Name = "Demo Tenant", Slug = "demo", Status = TenantStatus.Active };
            db.Tenants.Add(tenant);
            db.TenantDomains.Add(new TenantDomain { TenantId = tenant.Id, HostName = "demo.localhost", IsPrimary = true });
            db.TenantDefaultPolicies.Add(new TenantDefaultPolicy { TenantId = tenant.Id, RefreshTokensEnabled = true });
            await db.SaveChangesAsync(cancellationToken);
        }

        await EnsureUserAsync(userManager, tenant.Id, "system@masslab.local", "System Admin", isSystemAdmin: true, isTenantAdmin: false);
        var tenantAdmin = await EnsureUserAsync(userManager, tenant.Id, "admin@demo.local", "Demo Tenant Admin", isSystemAdmin: false, isTenantAdmin: true);

        foreach (var definition in SeedPermissions)
        {
            var permission = await db.TenantPermissions
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(
                    x => x.TenantId == tenant.Id && x.Name == definition.Name,
                    cancellationToken);

            if (permission is null)
            {
                db.TenantPermissions.Add(new TenantPermission
                {
                    TenantId = tenant.Id,
                    Name = definition.Name,
                    Category = definition.Category,
                    Description = definition.Description
                });
                continue;
            }

            permission.Category = definition.Category;
            permission.Description = definition.Description;
        }

        await db.SaveChangesAsync(cancellationToken);

        var adminRole = await db.TenantRoles.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.TenantId == tenant.Id && x.Name == "TenantAdmin", cancellationToken);
        if (adminRole is null)
        {
            adminRole = new TenantRole { TenantId = tenant.Id, Name = "TenantAdmin", Description = "Tenant administrator" };
            db.TenantRoles.Add(adminRole);
            await db.SaveChangesAsync(cancellationToken);
        }

        foreach (var permission in await db.TenantPermissions.IgnoreQueryFilters().Where(x => x.TenantId == tenant.Id).ToListAsync(cancellationToken))
        {
            if (!await db.RolePermissionAssignments.IgnoreQueryFilters().AnyAsync(x => x.TenantId == tenant.Id && x.RoleId == adminRole.Id && x.PermissionId == permission.Id, cancellationToken))
            {
                db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = tenant.Id, RoleId = adminRole.Id, PermissionId = permission.Id });
            }
        }

        if (!await db.UserRoleAssignments.IgnoreQueryFilters().AnyAsync(x => x.TenantId == tenant.Id && x.UserId == tenantAdmin.Id && x.RoleId == adminRole.Id, cancellationToken))
        {
            db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = tenant.Id, UserId = tenantAdmin.Id, RoleId = adminRole.Id });
        }

        // Client registrations are stored in OpenIddict. Do not depend on legacy custom client tables.
        var logicalClientId = formatter.NormalizeLogicalClientId("demo-web");
        var physicalClientId = formatter.FormatPhysicalClientId(tenant.Id, logicalClientId);
        var existingClient = await applicationManager.FindByClientIdAsync(physicalClientId, cancellationToken);
        if (existingClient is null)
        {
            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = physicalClientId,
                ClientSecret = "demo-secret",
                DisplayName = "Demo Web",
                ClientType = ClientTypes.Confidential,
                ConsentType = ConsentTypes.Implicit
            };

            // Store tenant ID in properties
            descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(tenant.Id);
            descriptor.Properties[TenantClientIdFormatter.LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(logicalClientId);
            descriptor.Properties["Type"] = JsonSerializer.SerializeToElement(ClientType.Web.ToString());
            descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(true);

            // Redirect URIs
            descriptor.RedirectUris.Add(new Uri("https://localhost:5003/signin-oidc"));
            descriptor.PostLogoutRedirectUris.Add(new Uri("https://localhost:5003/signout-callback-oidc"));

            // Permissions
            descriptor.Permissions.Add(Permissions.GrantTypes.AuthorizationCode);
            descriptor.Permissions.Add(Permissions.GrantTypes.RefreshToken);
            descriptor.Permissions.Add(Permissions.ResponseTypes.Code);
            descriptor.Permissions.Add(Permissions.Endpoints.Authorization);
            descriptor.Permissions.Add(Permissions.Endpoints.Token);
            descriptor.Permissions.Add(Permissions.Endpoints.Revocation);
            descriptor.Permissions.Add(Permissions.Endpoints.Introspection);
            descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.OpenId}");
            descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.Profile}");
            descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.Email}");

            await applicationManager.CreateAsync(descriptor, cancellationToken);
        }

        if (!await db.TenantSmtpSettings.IgnoreQueryFilters().AnyAsync(x => x.TenantId == tenant.Id, cancellationToken))
        {
            db.TenantSmtpSettings.Add(new TenantSmtpSettings
            {
                TenantId = tenant.Id,
                Host = "localhost",
                Port = 1025,
                FromEmail = "identity@demo.local",
                FromDisplayName = "Demo Identity"
            });
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task<ApplicationUser> EnsureUserAsync(UserManager<ApplicationUser> userManager, Guid tenantId, string email, string displayName, bool isSystemAdmin, bool isTenantAdmin)
    {
        var user = await userManager.Users.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Email == email);
        if (user is not null)
        {
            return user;
        }

        user = new ApplicationUser
        {
            TenantId = tenantId,
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            DisplayName = displayName,
            IsSystemAdmin = isSystemAdmin,
            IsTenantAdmin = isTenantAdmin
        };

        var result = await userManager.CreateAsync(user, "MassLab@12345");
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(x => x.Description)));
        }

        return user;
    }

    private sealed record SeedPermissionDefinition(string Name, string Category, string Description);
}
