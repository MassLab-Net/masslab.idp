using MassLab.Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure.Services;

public interface IRbacService
{
    Task<IReadOnlyCollection<string>> GetEffectivePermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
}

public sealed class RbacService : IRbacService
{
    private readonly ApplicationDbContext _db;

    public RbacService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyCollection<string>> GetEffectivePermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var rolePermissions = await _db.UserRoleAssignments
            .Where(x => x.UserId == userId)
            .Join(_db.RolePermissionAssignments, userRole => userRole.RoleId, rolePermission => rolePermission.RoleId, (_, rolePermission) => rolePermission.PermissionId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var grantedPermissionIds = await _db.UserPermissionAssignments
            .Where(x => x.UserId == userId && x.IsGranted)
            .Select(x => x.PermissionId)
            .ToListAsync(cancellationToken);

        var deniedPermissionIds = await _db.UserPermissionAssignments
            .Where(x => x.UserId == userId && !x.IsGranted)
            .Select(x => x.PermissionId)
            .ToListAsync(cancellationToken);

        var effectivePermissionIds = rolePermissions
            .Concat(grantedPermissionIds)
            .Except(deniedPermissionIds)
            .Distinct()
            .ToArray();

        return await _db.TenantPermissions
            .Where(x => effectivePermissionIds.Contains(x.Id))
            .Select(x => x.Name)
            .Distinct()
            .OrderBy(x => x)
            .ToListAsync(cancellationToken);
    }
}
