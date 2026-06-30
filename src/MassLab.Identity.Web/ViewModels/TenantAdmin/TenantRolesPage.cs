using MassLab.Identity.Application.Abstractions;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed record TenantRolesPage(
    IReadOnlyCollection<TenantRoleDto> Roles,
    IReadOnlyCollection<TenantPermissionDto> Permissions,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedPermissionIds,
    string? Query,
    string Sort,
    string Direction);
