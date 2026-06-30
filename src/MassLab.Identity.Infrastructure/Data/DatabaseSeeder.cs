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
    public static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var secretService = scope.ServiceProvider.GetRequiredService<ISecretService>();

        await db.Database.EnsureCreatedAsync(cancellationToken);

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

        var permissions = new[]
        {
            "tenants.manage",
            "users.manage",
            "roles.manage",
            "permissions.manage",
            "clients.manage",
            "providers.manage",
            "smtp.manage",
            "sessions.manage",
            "audit.read"
        };

        foreach (var permission in permissions)
        {
            if (!await db.TenantPermissions.IgnoreQueryFilters().AnyAsync(x => x.TenantId == tenant.Id && x.Name == permission, cancellationToken))
            {
                db.TenantPermissions.Add(new TenantPermission { TenantId = tenant.Id, Name = permission, Category = permission.Split('.')[0] });
            }
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

        if (!await db.ClientApplications.IgnoreQueryFilters().AnyAsync(x => x.TenantId == tenant.Id && x.ClientId == "demo-web", cancellationToken))
        {
            var client = new ClientApplication
            {
                TenantId = tenant.Id,
                Name = "Demo Web",
                ClientId = "demo-web",
                Type = ClientType.Web,
                SecretHash = secretService.HashSecret("demo-secret"),
                AllowedFlows = $"{GrantTypes.AuthorizationCode},{GrantTypes.RefreshToken}",
                AllowedScopes = $"{Scopes.OpenId},{Scopes.Profile},{Scopes.Email}",
                RefreshTokensEnabled = true
            };
            db.ClientApplications.Add(client);
            db.ClientRedirectUris.Add(new ClientRedirectUri { TenantId = tenant.Id, ClientApplication = client, Uri = "https://localhost:5003/signin-oidc" });
            db.ClientRedirectUris.Add(new ClientRedirectUri { TenantId = tenant.Id, ClientApplication = client, Uri = "https://localhost:5003/signout-callback-oidc", IsPostLogout = true });
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
}
