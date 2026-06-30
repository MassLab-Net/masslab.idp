using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Infrastructure.Services;

namespace MassLab.Identity.Infrastructure;

internal sealed class OpenIdApplicationService : IOpenIdQueries
{
    private readonly IRbacService _rbacService;

    public OpenIdApplicationService(IRbacService rbacService)
    {
        _rbacService = rbacService;
    }

    public Task<IReadOnlyCollection<string>> GetEffectivePermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
        => _rbacService.GetEffectivePermissionsAsync(userId, cancellationToken);

    public async Task<OpenIdUserInfoDto> GetUserInfoAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var userId = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var permissions = Guid.TryParse(userId, out var parsedUserId)
            ? await _rbacService.GetEffectivePermissionsAsync(parsedUserId, cancellationToken)
            : Array.Empty<string>();

        return new OpenIdUserInfoDto(
            userId,
            principal.FindFirstValue("display_name") ?? principal.Identity?.Name,
            principal.FindFirstValue(ClaimTypes.Email),
            principal.FindFirstValue("tenant_id"),
            string.Equals(principal.FindFirstValue("system_admin"), "true", StringComparison.OrdinalIgnoreCase),
            string.Equals(principal.FindFirstValue("tenant_admin"), "true", StringComparison.OrdinalIgnoreCase),
            permissions);
    }
}
