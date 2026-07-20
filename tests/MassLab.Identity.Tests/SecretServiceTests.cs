using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.DataProtection;

namespace MassLab.Identity.Tests;

public sealed class SecretServiceTests
{
    [Fact]
    public void Generated_secret_can_be_hashed_and_verified()
    {
        var service = CreateService();
        var secret = service.GenerateSecret();

        var hash = service.HashSecret(secret);

        Assert.True(service.VerifySecret(hash, secret));
        Assert.False(service.VerifySecret(hash, $"{secret}-wrong"));
    }

    [Fact]
    public void Stored_secret_can_be_protected_and_unprotected()
    {
        var service = CreateService();

        var protectedValue = service.Protect("smtp-password");

        Assert.NotEqual("smtp-password", protectedValue);
        Assert.Equal("smtp-password", service.Unprotect(protectedValue));
    }

    private static SecretService CreateService()
        => new(DataProtectionProvider.Create(new DirectoryInfo(Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N")))));
}
