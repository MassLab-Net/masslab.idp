using System.Text.Json;
using MassLab.Common.Multitenancy;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure;

/// <summary>
/// Service wrapping IOpenIddictApplicationManager with tenant isolation.
/// Stores tenantId in application Properties as JSON: {"TenantId": "guid"}
/// </summary>
internal sealed class OpenIddictClientService
{
    private static readonly HashSet<string> AllowedFlows = new(StringComparer.OrdinalIgnoreCase)
    {
        "authorization_code",
        "client_credentials",
        "refresh_token"
    };

    private static readonly HashSet<string> AllowedScopes = new(StringComparer.OrdinalIgnoreCase)
    {
        "openid",
        "profile",
        "email",
        "permissions"
    };

    private readonly IOpenIddictApplicationManager _manager;
    private readonly ICurrentTenant _tenant;
    private readonly ISecretService _secrets;
    private readonly TenantClientIdFormatter _formatter;

    public OpenIddictClientService(
        IOpenIddictApplicationManager manager,
        ICurrentTenant tenant,
        ISecretService secrets,
        TenantClientIdFormatter formatter)
    {
        _manager = manager;
        _tenant = tenant;
        _secrets = secrets;
        _formatter = formatter;
    }

    public async Task<IReadOnlyList<ClientApplicationDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return Array.Empty<ClientApplicationDto>();
        }

        var results = new List<ClientApplicationDto>();
        
        // OpenIddict doesn't support tenant filtering directly, so we need to filter in-memory
        await foreach (var app in _manager.ListAsync(cancellationToken: cancellationToken))
        {
            var tenantId = await GetTenantIdFromPropertiesAsync(app, cancellationToken);
            if (tenantId == _tenant.Id.Value)
            {
                results.Add(await MapToDtoAsync(app, cancellationToken));
            }
        }

        return results;
    }

    public async Task<CreateClientResult> CreateAsync(
        string name,
        string clientId,
        ClientType type,
        string[] redirectUris,
        string[] postLogoutRedirectUris,
        string scopes,
        string flows,
        CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CreateClientResult.Failure("Tenant is required.");
        }

        var validationErrors = ValidateClientInput(name, clientId, type, redirectUris, postLogoutRedirectUris, scopes, flows);
        if (validationErrors.Count > 0)
        {
            return CreateClientResult.Failure(validationErrors.ToArray());
        }

        name = name.Trim();
        clientId = _formatter.NormalizeLogicalClientId(clientId);
        redirectUris = NormalizeUris(redirectUris);
        postLogoutRedirectUris = NormalizeUris(postLogoutRedirectUris);
        var physicalClientId = _formatter.FormatPhysicalClientId(_tenant.Id.Value, clientId);

        // Check if client already exists
        var existing = await _manager.FindByClientIdAsync(physicalClientId, cancellationToken);
        if (existing is not null)
        {
            return CreateClientResult.Failure($"Client '{clientId}' already exists.");
        }

        var plainSecret = type is ClientType.Service or ClientType.Web ? _secrets.GenerateSecret() : null;
        
        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = physicalClientId,
            DisplayName = name,
            ClientType = type == ClientType.Spa ? ClientTypes.Public : ClientTypes.Confidential,
            ConsentType = ConsentTypes.Implicit
        };

        if (plainSecret is not null)
        {
            descriptor.ClientSecret = plainSecret;
        }

        // Store tenant metadata in Properties
        descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(_tenant.Id.Value);
        descriptor.Properties[TenantClientIdFormatter.LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(clientId);
        descriptor.Properties["Type"] = JsonSerializer.SerializeToElement(type.ToString());
        descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(true);

        // Parse and set redirect URIs
        foreach (var uri in redirectUris.Where(u => !string.IsNullOrWhiteSpace(u)))
        {
            descriptor.RedirectUris.Add(new Uri(uri.Trim(), UriKind.Absolute));
        }

        // Parse and set post logout redirect URIs
        foreach (var uri in postLogoutRedirectUris.Where(u => !string.IsNullOrWhiteSpace(u)))
        {
            descriptor.PostLogoutRedirectUris.Add(new Uri(uri.Trim(), UriKind.Absolute));
        }

        // Parse and set permissions (flows + scopes + endpoints)
        SetPermissionsFromFlows(descriptor, flows);
        SetPermissionsFromScopes(descriptor, scopes);

        await _manager.CreateAsync(descriptor, cancellationToken);
        return CreateClientResult.Success(clientId, plainSecret);
    }

    public async Task<CommandResult> UpdateAsync(
        string clientId,
        string name,
        ClientType type,
        string[] redirectUris,
        string[] postLogoutRedirectUris,
        string scopes,
        string flows,
        bool enabled,
        CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var validationErrors = ValidateClientInput(name, clientId, type, redirectUris, postLogoutRedirectUris, scopes, flows);
        if (validationErrors.Count > 0)
        {
            return CommandResult.Failure(validationErrors);
        }

        name = name.Trim();
        clientId = _formatter.NormalizeLogicalClientId(clientId);
        redirectUris = NormalizeUris(redirectUris);
        postLogoutRedirectUris = NormalizeUris(postLogoutRedirectUris);
        var physicalClientId = _formatter.FormatPhysicalClientId(_tenant.Id.Value, clientId);

        var application = await _manager.FindByClientIdAsync(physicalClientId, cancellationToken);
        if (application is null)
        {
            return CommandResult.Missing();
        }

        // Verify tenant ownership
        var tenantId = await GetTenantIdFromPropertiesAsync(application, cancellationToken);
        if (tenantId != _tenant.Id.Value)
        {
            return CommandResult.Missing(); // Act as if not found to prevent tenant leak
        }

        var descriptor = new OpenIddictApplicationDescriptor();
        await _manager.PopulateAsync(descriptor, application, cancellationToken);

        descriptor.DisplayName = name;
        descriptor.ClientType = type == ClientType.Spa ? ClientTypes.Public : ClientTypes.Confidential;

        // Update properties
        descriptor.ClientId = physicalClientId;
        descriptor.Properties["Type"] = JsonSerializer.SerializeToElement(type.ToString());
        descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(enabled);
        descriptor.Properties[TenantClientIdFormatter.LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(clientId);

        // Update redirect URIs
        descriptor.RedirectUris.Clear();
        foreach (var uri in redirectUris.Where(u => !string.IsNullOrWhiteSpace(u)))
        {
            descriptor.RedirectUris.Add(new Uri(uri.Trim(), UriKind.Absolute));
        }

        // Update post logout redirect URIs
        descriptor.PostLogoutRedirectUris.Clear();
        foreach (var uri in postLogoutRedirectUris.Where(u => !string.IsNullOrWhiteSpace(u)))
        {
            descriptor.PostLogoutRedirectUris.Add(new Uri(uri.Trim(), UriKind.Absolute));
        }

        // Update permissions
        descriptor.Permissions.Clear();
        SetPermissionsFromFlows(descriptor, flows);
        SetPermissionsFromScopes(descriptor, scopes);

        await _manager.UpdateAsync(application, descriptor, cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DeleteAsync(string clientId, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var physicalClientId = _formatter.FormatPhysicalClientId(_tenant.Id.Value, _formatter.NormalizeLogicalClientId(clientId));
        var application = await _manager.FindByClientIdAsync(physicalClientId, cancellationToken);
        if (application is null)
        {
            return CommandResult.Missing();
        }

        // Verify tenant ownership
        var tenantId = await GetTenantIdFromPropertiesAsync(application, cancellationToken);
        if (tenantId != _tenant.Id.Value)
        {
            return CommandResult.Missing();
        }

        await _manager.DeleteAsync(application, cancellationToken);
        return CommandResult.Success();
    }

    private async Task<Guid> GetTenantIdFromPropertiesAsync(object application, CancellationToken cancellationToken)
    {
        var properties = await _manager.GetPropertiesAsync(application, cancellationToken);
        if (properties.TryGetValue(nameof(TenantEntity.TenantId), out var element) && element.ValueKind == JsonValueKind.String)
        {
            if (Guid.TryParse(element.GetString(), out var tenantId))
            {
                return tenantId;
            }
        }
        return Guid.Empty;
    }

    private async Task<ClientApplicationDto> MapToDtoAsync(object application, CancellationToken cancellationToken)
    {
        var id = await _manager.GetIdAsync(application, cancellationToken) ?? string.Empty;
        var physicalClientId = await _manager.GetClientIdAsync(application, cancellationToken) ?? string.Empty;
        var properties = await _manager.GetPropertiesAsync(application, cancellationToken);
        var clientId = _formatter.GetLogicalClientId(properties, physicalClientId);
        var displayName = await _manager.GetDisplayNameAsync(application, cancellationToken) ?? clientId;
        var permissions = await _manager.GetPermissionsAsync(application, cancellationToken);
        var redirectUris = await _manager.GetRedirectUrisAsync(application, cancellationToken);
        var postLogoutRedirectUris = await _manager.GetPostLogoutRedirectUrisAsync(application, cancellationToken);

        var type = properties.TryGetValue("Type", out var typeElement) && typeElement.ValueKind == JsonValueKind.String
            ? typeElement.GetString() ?? "Spa"
            : "Spa";

        // Fix: Check for both True and Boolean value
        var enabled = properties.TryGetValue("Enabled", out var enabledElement) && 
            (enabledElement.ValueKind == JsonValueKind.True || 
             (enabledElement.ValueKind == JsonValueKind.String && enabledElement.GetString() == "True"));

        // Extract flows from permissions
        var flows = new List<string>();
        if (permissions.Contains(Permissions.GrantTypes.AuthorizationCode)) flows.Add("authorization_code");
        if (permissions.Contains(Permissions.GrantTypes.ClientCredentials)) flows.Add("client_credentials");
        if (permissions.Contains(Permissions.GrantTypes.RefreshToken)) flows.Add("refresh_token");

        // Extract scopes from permissions
        var scopes = new List<string>();
        if (permissions.Contains($"{Permissions.Prefixes.Scope}{Scopes.OpenId}")) scopes.Add("openid");
        if (permissions.Contains($"{Permissions.Prefixes.Scope}{Scopes.Profile}")) scopes.Add("profile");
        if (permissions.Contains($"{Permissions.Prefixes.Scope}{Scopes.Email}")) scopes.Add("email");
        if (permissions.Contains($"{Permissions.Prefixes.Scope}permissions")) scopes.Add("permissions");

        return new ClientApplicationDto(
            id,
            displayName,
            clientId,
            type,
            enabled,
            string.Join(" ", flows),
            string.Join(" ", scopes),
            redirectUris.Select(u => u.ToString()).ToArray(),
            postLogoutRedirectUris.Select(u => u.ToString()).ToArray()
        );
    }

    private static void SetPermissionsFromFlows(OpenIddictApplicationDescriptor descriptor, string flows)
    {
        if (string.IsNullOrWhiteSpace(flows)) return;

        var flowList = flows.Split(new[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        
        foreach (var flow in flowList)
        {
            switch (flow.ToLowerInvariant())
            {
                case "authorization_code":
                    descriptor.Permissions.Add(Permissions.GrantTypes.AuthorizationCode);
                    descriptor.Permissions.Add(Permissions.ResponseTypes.Code);
                    descriptor.Permissions.Add(Permissions.Endpoints.Authorization);
                    descriptor.Permissions.Add(Permissions.Endpoints.Token);
                    break;
                case "client_credentials":
                    descriptor.Permissions.Add(Permissions.GrantTypes.ClientCredentials);
                    descriptor.Permissions.Add(Permissions.Endpoints.Token);
                    break;
                case "refresh_token":
                    descriptor.Permissions.Add(Permissions.GrantTypes.RefreshToken);
                    descriptor.Permissions.Add(Permissions.Endpoints.Token);
                    break;
            }
        }

        descriptor.Permissions.Add(Permissions.Endpoints.Revocation);
        if (descriptor.Permissions.Contains(Permissions.GrantTypes.ClientCredentials))
        {
            descriptor.Permissions.Add(Permissions.Endpoints.Introspection);
        }
    }

    private static void SetPermissionsFromScopes(OpenIddictApplicationDescriptor descriptor, string scopes)
    {
        if (string.IsNullOrWhiteSpace(scopes)) return;

        var scopeList = scopes.Split(new[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        foreach (var scope in scopeList)
        {
            switch (scope.ToLowerInvariant())
            {
                case "openid":
                    descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.OpenId}");
                    break;
                case "profile":
                    descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.Profile}");
                    break;
                case "email":
                    descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}{Scopes.Email}");
                    break;
                case "permissions":
                    descriptor.Permissions.Add($"{Permissions.Prefixes.Scope}permissions");
                    break;
            }
        }
    }

    private static List<string> ValidateClientInput(
        string name,
        string clientId,
        ClientType type,
        string[] redirectUris,
        string[] postLogoutRedirectUris,
        string scopes,
        string flows)
    {
        var errors = new List<string>();
        var normalizedRedirectUris = NormalizeUris(redirectUris);
        var normalizedPostLogoutRedirectUris = NormalizeUris(postLogoutRedirectUris);
        var flowValues = SplitValues(flows);
        var scopeValues = SplitValues(scopes);
        var flowSet = flowValues.ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(name))
        {
            errors.Add("Client name is required.");
        }

        if (string.IsNullOrWhiteSpace(clientId))
        {
            errors.Add("Client ID is required.");
        }

        if (!Enum.IsDefined(type))
        {
            errors.Add("Client type is invalid.");
        }

        foreach (var uri in normalizedRedirectUris)
        {
            if (!Uri.TryCreate(uri, UriKind.Absolute, out var parsedUri))
            {
                errors.Add($"Redirect URI '{uri}' is not a valid absolute URI.");
                continue;
            }

            if (!IsAllowedRedirectUri(parsedUri))
            {
                errors.Add($"Redirect URI '{uri}' must use HTTPS unless it targets a loopback address.");
            }
        }

        foreach (var uri in normalizedPostLogoutRedirectUris)
        {
            if (!Uri.TryCreate(uri, UriKind.Absolute, out var parsedUri))
            {
                errors.Add($"Post logout redirect URI '{uri}' is not a valid absolute URI.");
                continue;
            }

            if (!IsAllowedRedirectUri(parsedUri))
            {
                errors.Add($"Post logout redirect URI '{uri}' must use HTTPS unless it targets a loopback address.");
            }
        }

        foreach (var flow in flowValues)
        {
            if (!AllowedFlows.Contains(flow))
            {
                errors.Add($"Flow '{flow}' is not supported.");
            }
        }

        foreach (var scope in scopeValues)
        {
            if (!AllowedScopes.Contains(scope))
            {
                errors.Add($"Scope '{scope}' is not supported.");
            }
        }

        switch (type)
        {
            case ClientType.Service:
                if (normalizedRedirectUris.Length > 0 || normalizedPostLogoutRedirectUris.Length > 0)
                {
                    errors.Add("Service clients cannot define redirect URIs.");
                }

                if (!flowSet.SetEquals(["client_credentials"]))
                {
                    errors.Add("Service clients must use only the client_credentials flow.");
                }
                break;

            case ClientType.Web:
                if (normalizedRedirectUris.Length == 0)
                {
                    errors.Add("Web clients must define at least one redirect URI.");
                }

                if (!flowSet.Contains("authorization_code"))
                {
                    errors.Add("Web clients must allow the authorization_code flow.");
                }

                if (flowSet.Contains("client_credentials"))
                {
                    errors.Add("Web clients cannot use the client_credentials flow.");
                }
                break;

            case ClientType.Spa:
            case ClientType.Mobile:
                if (normalizedRedirectUris.Length == 0)
                {
                    errors.Add($"{type} clients must define at least one redirect URI.");
                }

                if (!flowSet.Contains("authorization_code"))
                {
                    errors.Add($"{type} clients must allow the authorization_code flow.");
                }

                if (flowSet.Contains("client_credentials"))
                {
                    errors.Add($"{type} clients cannot use the client_credentials flow.");
                }
                break;
        }

        if (flowSet.Contains("refresh_token") && !flowSet.Contains("authorization_code"))
        {
            errors.Add("The refresh_token flow requires the authorization_code flow.");
        }

        if (flowSet.Contains("authorization_code") && !scopeValues.Any(scope => string.Equals(scope, "openid", StringComparison.OrdinalIgnoreCase)))
        {
            errors.Add("Interactive clients must request the openid scope.");
        }

        return errors;
    }

    private static string[] NormalizeUris(IEnumerable<string> values)
        => values
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

    private static bool IsAllowedRedirectUri(Uri uri)
        => uri.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase) ||
           uri.IsLoopback;

    private static string[] SplitValues(string value)
        => string.IsNullOrWhiteSpace(value)
            ? []
            : value.Split(new[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
