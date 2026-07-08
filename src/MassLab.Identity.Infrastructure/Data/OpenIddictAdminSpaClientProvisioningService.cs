using System.Text.Json;
using MassLab.Identity.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure.Data;

internal sealed class OpenIddictAdminSpaClientProvisioningService
{
    private readonly ApplicationDbContext _db;
    private readonly IOpenIddictApplicationManager _manager;
    private readonly IOptions<OpenIddictAdminSpaClientOptions> _options;
    private readonly TenantClientIdFormatter _formatter;

    public OpenIddictAdminSpaClientProvisioningService(
        ApplicationDbContext db,
        IOpenIddictApplicationManager manager,
        IOptions<OpenIddictAdminSpaClientOptions> options,
        TenantClientIdFormatter formatter)
    {
        _db = db;
        _manager = manager;
        _options = options;
        _formatter = formatter;
    }

    public async Task EnsureConfiguredAsync(CancellationToken cancellationToken = default)
    {
        var options = _options.Value;
        if (!options.Enabled || string.IsNullOrWhiteSpace(options.ClientId))
        {
            return;
        }

        var tenants = await _db.Tenants.IgnoreQueryFilters().ToListAsync(cancellationToken);
        foreach (var tenant in tenants)
        {
            await EnsureConfiguredAsync(tenant, cancellationToken);
        }
    }

    public async Task EnsureConfiguredAsync(Tenant tenant, CancellationToken cancellationToken = default)
    {
        var options = _options.Value;
        if (!options.Enabled || string.IsNullOrWhiteSpace(options.ClientId))
        {
            return;
        }

        var descriptor = CreateDescriptor(options, tenant.Id, _formatter.NormalizeLogicalClientId(options.ClientId));
        var physicalClientId = descriptor.ClientId ?? throw new InvalidOperationException("Physical client ID was not generated.");
        var application = await _manager.FindByClientIdAsync(physicalClientId, cancellationToken);
        if (application is null)
        {
            await _manager.CreateAsync(descriptor, cancellationToken);
            return;
        }

        await _manager.UpdateAsync(application, descriptor, cancellationToken);
    }

    private OpenIddictApplicationDescriptor CreateDescriptor(OpenIddictAdminSpaClientOptions options, Guid tenantId, string logicalClientId)
    {
        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = _formatter.FormatPhysicalClientId(tenantId, logicalClientId),
            ClientType = ClientTypes.Public,
            ConsentType = ConsentTypes.Implicit,
            DisplayName = options.DisplayName
        };

        foreach (var redirectUri in options.RedirectUris.Where(static uri => !string.IsNullOrWhiteSpace(uri)))
        {
            descriptor.RedirectUris.Add(new Uri(redirectUri, UriKind.Absolute));
        }

        foreach (var redirectUri in options.PostLogoutRedirectUris.Where(static uri => !string.IsNullOrWhiteSpace(uri)))
        {
            descriptor.PostLogoutRedirectUris.Add(new Uri(redirectUri, UriKind.Absolute));
        }

        descriptor.Permissions.UnionWith(
        [
            Permissions.Endpoints.Authorization,
            Permissions.Endpoints.EndSession,
            Permissions.Endpoints.Token,
            Permissions.GrantTypes.AuthorizationCode,
            Permissions.GrantTypes.RefreshToken,
            Permissions.ResponseTypes.Code,
            $"{Permissions.Prefixes.Scope}{Scopes.OpenId}",
            $"{Permissions.Prefixes.Scope}{Scopes.Email}",
            $"{Permissions.Prefixes.Scope}{Scopes.Profile}",
            $"{Permissions.Prefixes.Scope}permissions"
        ]);

        descriptor.Requirements.Add(Requirements.Features.ProofKeyForCodeExchange);
        descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(tenantId);
        descriptor.Properties[TenantClientIdFormatter.LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(logicalClientId);
        descriptor.Properties["Type"] = JsonSerializer.SerializeToElement(ClientType.Spa.ToString());
        descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(true);

        return descriptor;
    }
}
