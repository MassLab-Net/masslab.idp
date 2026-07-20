using System.Security.Claims;
using System.Text.Json;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using OpenIddict.Server;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure;

public sealed class OpenIddictTenantClientGuard :
    IOpenIddictServerHandler<OpenIddictServerEvents.ValidateAuthorizationRequestContext>,
    IOpenIddictServerHandler<OpenIddictServerEvents.ValidateTokenRequestContext>,
    IOpenIddictServerHandler<OpenIddictServerEvents.ValidateIntrospectionRequestContext>,
    IOpenIddictServerHandler<OpenIddictServerEvents.ValidateRevocationRequestContext>
{
    private const string DisabledClientMessage = "The client application is disabled.";
    private const string InvalidTenantMessage = "The client application is not allowed for this tenant.";
    private const string InvalidClientMessage = "The client application is invalid.";

    private readonly IOpenIddictApplicationManager _applications;
    private readonly ICurrentTenantAccessor _currentTenant;
    private readonly ILogger<OpenIddictTenantClientGuard> _logger;
    private readonly ApplicationDbContext _db;

    public OpenIddictTenantClientGuard(
        IOpenIddictApplicationManager applications,
        ICurrentTenantAccessor currentTenant,
        ILogger<OpenIddictTenantClientGuard> logger,
        ApplicationDbContext db)
    {
        _applications = applications;
        _currentTenant = currentTenant;
        _logger = logger;
        _db = db;
    }

    public async ValueTask HandleAsync(OpenIddictServerEvents.ValidateAuthorizationRequestContext context)
    {
        var clientTenantId = await ValidateClientAsync(context.ClientId, context, context.CancellationToken);
        if (!clientTenantId.HasValue)
        {
            return;
        }

        if (!TenantMatchesCurrentRequest(clientTenantId.Value))
        {
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
        }
    }

    public async ValueTask HandleAsync(OpenIddictServerEvents.ValidateTokenRequestContext context)
    {
        var clientId = context.ClientId ?? context.Request?.ClientId;
        var clientTenantId = await ValidateClientAsync(clientId, context, context.CancellationToken);
        if (!clientTenantId.HasValue)
        {
            return;
        }

        if (!TenantMatchesCurrentRequest(clientTenantId.Value))
        {
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
            return;
        }

        var principal = context.AuthorizationCodePrincipal ?? context.RefreshTokenPrincipal;
        var userTenantId = principal?.FindFirstValue("tenant_id");
        _logger.LogInformation(
            "OpenIddict token validation: currentTenantId={CurrentTenantId}, currentTenantSlug={CurrentTenantSlug}, clientId={ClientId}, clientTenantId={ClientTenantId}, userTenantId={UserTenantId}, grantType={GrantType}",
            _currentTenant.Id,
            _currentTenant.Slug,
            clientId,
            clientTenantId,
            userTenantId,
            context.Request?.GrantType);
        if (string.IsNullOrWhiteSpace(userTenantId))
        {
            return;
        }

        if (!TenantMatchesUser(clientTenantId.Value, userTenantId))
        {
            _logger.LogWarning(
                "OpenIddict token validation rejected due to tenant mismatch: currentTenantId={CurrentTenantId}, clientId={ClientId}, clientTenantId={ClientTenantId}, userTenantId={UserTenantId}",
                _currentTenant.Id,
                clientId,
                clientTenantId,
                userTenantId);
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
            return;
        }

        await RejectStaleAuthorizationAsync(principal, context, context.CancellationToken);
    }

    public async ValueTask HandleAsync(OpenIddictServerEvents.ValidateIntrospectionRequestContext context)
    {
        var clientTenantId = await ValidateClientAsync(context.ClientId, context, context.CancellationToken);
        if (clientTenantId.HasValue && !TenantMatchesCurrentRequest(clientTenantId.Value))
        {
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
        }
    }

    public async ValueTask HandleAsync(OpenIddictServerEvents.ValidateRevocationRequestContext context)
    {
        var clientTenantId = await ValidateClientAsync(context.ClientId, context, context.CancellationToken);
        if (clientTenantId.HasValue && !TenantMatchesCurrentRequest(clientTenantId.Value))
        {
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
        }
    }

    private async ValueTask<Guid?> ValidateClientAsync(
        string? clientId,
        OpenIddictServerEvents.BaseValidatingContext context,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(clientId))
        {
            return null;
        }

        var application = await _applications.FindByClientIdAsync(clientId, cancellationToken);
        if (application is null)
        {
            _logger.LogWarning(
                "OpenIddict client lookup returned null: clientId={ClientId}, currentTenantId={CurrentTenantId}, currentTenantSlug={CurrentTenantSlug}",
                clientId,
                _currentTenant.Id,
                _currentTenant.Slug);
            context.Reject(Errors.InvalidClient, InvalidClientMessage);
            return null;
        }

        if (!await IsEnabledAsync(application, cancellationToken))
        {
            context.Reject(Errors.InvalidClient, DisabledClientMessage);
            return null;
        }

        var tenantId = await GetTenantIdAsync(application, cancellationToken);
        if (!tenantId.HasValue)
        {
            _logger.LogWarning(
                "OpenIddict client has no tenant property: clientId={ClientId}, currentTenantId={CurrentTenantId}, currentTenantSlug={CurrentTenantSlug}",
                clientId,
                _currentTenant.Id,
                _currentTenant.Slug);
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
            return null;
        }

        _logger.LogInformation(
            "OpenIddict client validated: clientId={ClientId}, clientTenantId={ClientTenantId}, currentTenantId={CurrentTenantId}, currentTenantSlug={CurrentTenantSlug}",
            clientId,
            tenantId,
            _currentTenant.Id,
            _currentTenant.Slug);

        return tenantId.Value;
    }

    private async ValueTask<bool> IsEnabledAsync(object application, CancellationToken cancellationToken)
    {
        var properties = await _applications.GetPropertiesAsync(application, cancellationToken);
        return properties.TryGetValue("Enabled", out var element) && element.ValueKind switch
        {
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.String => bool.TryParse(element.GetString(), out var value) && value,
            _ => false
        };
    }

    private async ValueTask<Guid?> GetTenantIdAsync(object application, CancellationToken cancellationToken)
    {
        var properties = await _applications.GetPropertiesAsync(application, cancellationToken);
        if (!properties.TryGetValue(nameof(TenantEntity.TenantId), out var element))
        {
            return null;
        }

        return element.ValueKind switch
        {
            JsonValueKind.String when Guid.TryParse(element.GetString(), out var tenantId) => tenantId,
            _ => null
        };
    }

    private bool TenantMatchesCurrentRequest(Guid clientTenantId)
        => !_currentTenant.Id.HasValue || _currentTenant.Id.Value == clientTenantId;

    private static bool TenantMatchesUser(Guid clientTenantId, string userTenantId)
        => Guid.TryParse(userTenantId, out var parsedUserTenantId) &&
           clientTenantId == parsedUserTenantId;

    private async Task RejectStaleAuthorizationAsync(
        ClaimsPrincipal? principal,
        OpenIddictServerEvents.BaseValidatingContext context,
        CancellationToken cancellationToken)
    {
        var subject = principal?.FindFirstValue(Claims.Subject) ?? principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        var version = principal?.FindFirstValue("authorization_version");
        if (!Guid.TryParse(subject, out var userId) || !int.TryParse(version, out var tokenVersion))
        {
            return;
        }

        var currentVersion = await _db.Users.IgnoreQueryFilters()
            .Where(x => x.Id == userId)
            .Select(x => (int?)x.AuthorizationVersion)
            .FirstOrDefaultAsync(cancellationToken);
        if (!currentVersion.HasValue || currentVersion.Value != tokenVersion)
        {
            context.Reject(Errors.InvalidGrant, "The authorization grant is no longer valid.");
        }
    }
}
