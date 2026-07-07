using System.Security.Claims;
using System.Text.Json;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Domain;
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

    private readonly IOpenIddictApplicationManager _applications;
    private readonly ICurrentTenantAccessor _currentTenant;

    public OpenIddictTenantClientGuard(
        IOpenIddictApplicationManager applications,
        ICurrentTenantAccessor currentTenant)
    {
        _applications = applications;
        _currentTenant = currentTenant;
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
            return;
        }

        var userTenantId = context.Transaction.Principal?.FindFirstValue("tenant_id");
        if (string.IsNullOrWhiteSpace(userTenantId))
        {
            return;
        }

        if (!TenantMatchesUser(clientTenantId.Value, userTenantId))
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
        if (string.IsNullOrWhiteSpace(userTenantId))
        {
            return;
        }

        if (!TenantMatchesUser(clientTenantId.Value, userTenantId))
        {
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
        }
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
            context.Reject(Errors.InvalidClient, InvalidTenantMessage);
            return null;
        }

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
}
