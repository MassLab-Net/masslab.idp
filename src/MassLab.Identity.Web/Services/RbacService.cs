using MassLab.Identity.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Web.Services;

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
        return await _db.UserRoleAssignments
            .Where(x => x.UserId == userId)
            .Join(_db.RolePermissionAssignments, userRole => userRole.RoleId, rolePermission => rolePermission.RoleId, (_, rolePermission) => rolePermission.PermissionId)
            .Join(_db.TenantPermissions, permissionId => permissionId, permission => permission.Id, (_, permission) => permission.Name)
            .Distinct()
            .OrderBy(x => x)
            .ToListAsync(cancellationToken);
    }
}

