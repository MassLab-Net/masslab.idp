using Microsoft.Extensions.DependencyInjection;

namespace MassLab.Identity.Infrastructure.Data;

public static class OpenIddictAdminSpaClientSeeder
{
    public static async Task EnsureConfiguredAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var provisioner = scope.ServiceProvider.GetRequiredService<OpenIddictAdminSpaClientProvisioningService>();
        await provisioner.EnsureConfiguredAsync(cancellationToken);
    }
}
