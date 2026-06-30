using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Tests;

public sealed class ApplicationDbContextTests
{
    [Fact]
    public async Task Tenant_query_filter_limits_tenant_owned_data()
    {
        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();
        var currentTenant = new CurrentTenant();
        currentTenant.Set(tenantA, "tenant-a", TenantStatus.Active);
        await using var db = CreateDb(currentTenant);

        db.TenantRoles.Add(new TenantRole { TenantId = tenantA, Name = "Admin" });
        db.TenantRoles.Add(new TenantRole { TenantId = tenantB, Name = "Other" });
        await db.SaveChangesAsync();

        var roles = await db.TenantRoles.ToListAsync();

        Assert.Single(roles);
        Assert.Equal(tenantA, roles[0].TenantId);
    }

    [Fact]
    public async Task Rbac_service_returns_effective_permissions()
    {
        var tenantId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var roleId = Guid.NewGuid();
        var permissionId = Guid.NewGuid();
        var currentTenant = new CurrentTenant();
        currentTenant.Set(tenantId, "demo", TenantStatus.Active);
        await using var db = CreateDb(currentTenant);

        db.TenantRoles.Add(new TenantRole { Id = roleId, TenantId = tenantId, Name = "Admin" });
        db.TenantPermissions.Add(new TenantPermission { Id = permissionId, TenantId = tenantId, Name = "users.manage" });
        db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = tenantId, UserId = userId, RoleId = roleId });
        db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = tenantId, RoleId = roleId, PermissionId = permissionId });
        await db.SaveChangesAsync();

        var permissions = await new RbacService(db).GetEffectivePermissionsAsync(userId);

        Assert.Equal(["users.manage"], permissions);
    }

    private static ApplicationDbContext CreateDb(CurrentTenant currentTenant)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options, currentTenant);
    }
}

