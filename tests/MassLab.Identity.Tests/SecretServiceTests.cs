using MassLab.Identity.Infrastructure.Services;

namespace MassLab.Identity.Tests;

public sealed class SecretServiceTests
{
    [Fact]
    public void Generated_secret_can_be_hashed_and_verified()
    {
        var service = new SecretService();
        var secret = service.GenerateSecret();

        var hash = service.HashSecret(secret);

        Assert.True(service.VerifySecret(hash, secret));
        Assert.False(service.VerifySecret(hash, $"{secret}-wrong"));
    }
}

