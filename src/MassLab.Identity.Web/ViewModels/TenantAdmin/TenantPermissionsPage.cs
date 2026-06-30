using MassLab.Identity.Application.Abstractions;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed record TenantPermissionsPage(
    IReadOnlyCollection<TenantPermissionDto> Permissions,
    string? Query,
    string Sort,
    string Direction);
