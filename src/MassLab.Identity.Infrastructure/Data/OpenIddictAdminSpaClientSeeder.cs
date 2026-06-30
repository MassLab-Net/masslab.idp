using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Infrastructure.Data;

public static class OpenIddictAdminSpaClientSeeder
{
    public static async Task EnsureConfiguredAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var options = scope.ServiceProvider.GetRequiredService<IOptions<OpenIddictAdminSpaClientOptions>>().Value;
        if (!options.Enabled || string.IsNullOrWhiteSpace(options.ClientId))
        {
            return;
        }

        var manager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();
        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = options.ClientId,
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
            Permissions.Scopes.Email,
            Permissions.Scopes.Profile,
            Permissions.Scopes.Roles,
            $"{Permissions.Prefixes.Scope}permissions"
        ]);

        descriptor.Requirements.Add(Requirements.Features.ProofKeyForCodeExchange);

        var application = await manager.FindByClientIdAsync(options.ClientId, cancellationToken);
        if (application is null)
        {
            await manager.CreateAsync(descriptor, cancellationToken);
            return;
        }

        await manager.UpdateAsync(application, descriptor, cancellationToken);
    }
}
