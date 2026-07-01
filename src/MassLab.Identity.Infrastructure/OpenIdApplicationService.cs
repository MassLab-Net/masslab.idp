using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure;

internal sealed class OpenIdApplicationService : IOpenIdQueries
{
    private readonly IRbacService _rbacService;
    private readonly ApplicationDbContext _db;

    public OpenIdApplicationService(IRbacService rbacService, ApplicationDbContext db)
    {
        _rbacService = rbacService;
        _db = db;
    }

    public Task<IReadOnlyCollection<string>> GetEffectivePermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
        => _rbacService.GetEffectivePermissionsAsync(userId, cancellationToken);

    public async Task<OpenIdUserInfoDto> GetUserInfoAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var userId = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var tenantId = principal.FindFirstValue("tenant_id");
        var permissions = Guid.TryParse(userId, out var parsedUserId)
            ? await _rbacService.GetEffectivePermissionsAsync(parsedUserId, cancellationToken)
            : Array.Empty<string>();
        var tenantName = Guid.TryParse(tenantId, out var parsedTenantId)
            ? await _db.Tenants
                .IgnoreQueryFilters()
                .Where(x => x.Id == parsedTenantId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken)
            : null;

        return new OpenIdUserInfoDto(
            userId,
            principal.FindFirstValue("display_name") ?? principal.Identity?.Name,
            principal.FindFirstValue(ClaimTypes.Email),
            tenantId,
            tenantName,
            string.Equals(principal.FindFirstValue("system_admin"), "true", StringComparison.OrdinalIgnoreCase),
            string.Equals(principal.FindFirstValue("tenant_admin"), "true", StringComparison.OrdinalIgnoreCase),
            permissions);
    }
}
