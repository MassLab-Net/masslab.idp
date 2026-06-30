using MassLab.Identity.Application.Abstractions;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed record TenantUsersPage(
    IReadOnlyCollection<TenantUserDto> Users,
    IReadOnlyCollection<TenantRoleDto> Roles,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedRoleIds,
    string? Query,
    string Sort,
    string Direction);
