using MassLab.Identity.Web.Services;

namespace MassLab.Identity.Tests;

public sealed class TotpServiceTests
{
    [Fact]
    public void Generated_secret_has_authenticator_uri()
    {
        var service = new TotpService();
        var secret = service.GenerateSecret();

        var uri = service.GetAuthenticatorUri("MassLab Identity", "admin@example.com", secret);

        Assert.StartsWith("otpauth://totp/", uri);
        Assert.Contains(secret, uri);
    }

    [Fact]
    public void Invalid_code_is_rejected()
    {
        var service = new TotpService();
        var secret = service.GenerateSecret();

        Assert.False(service.VerifyCode(secret, "000000"));
    }
}

