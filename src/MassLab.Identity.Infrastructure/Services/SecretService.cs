using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;

namespace MassLab.Identity.Infrastructure.Services;

public interface ISecretService
{
    string GenerateSecret(int byteLength = 32);
    string HashSecret(string secret);
    bool VerifySecret(string hashedSecret, string providedSecret);
    string Protect(string plaintext);
    string Unprotect(string protectedValue);
}

public sealed class SecretService : ISecretService
{
    private readonly PasswordHasher<object> _hasher = new();
    private static readonly object Subject = new();
    private readonly IDataProtector _protector;

    public SecretService(IDataProtectionProvider dataProtectionProvider)
    {
        _protector = dataProtectionProvider.CreateProtector("MassLab.Identity.StoredSecrets.v1");
    }

    public string GenerateSecret(int byteLength = 32)
    {
        var bytes = RandomNumberGenerator.GetBytes(byteLength);
        return Convert.ToBase64String(bytes).Replace("+", "-", StringComparison.Ordinal).Replace("/", "_", StringComparison.Ordinal).TrimEnd('=');
    }

    public string HashSecret(string secret) => _hasher.HashPassword(Subject, secret);

    public bool VerifySecret(string hashedSecret, string providedSecret)
    {
        var result = _hasher.VerifyHashedPassword(Subject, hashedSecret, providedSecret);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }

    public string Protect(string plaintext) => _protector.Protect(plaintext);

    public string Unprotect(string protectedValue) => _protector.Unprotect(protectedValue);
}
