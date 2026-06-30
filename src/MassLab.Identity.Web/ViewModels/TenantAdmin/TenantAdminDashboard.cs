using MassLab.Identity.Application.Abstractions;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed record TenantAdminDashboard(
    int Users,
    int Roles,
    int Permissions,
    int Clients,
    int Providers,
    int Sessions,
    IReadOnlyCollection<AdminAuditLogDto> RecentAuditLogs);
