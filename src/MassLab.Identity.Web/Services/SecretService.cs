using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;

namespace MassLab.Identity.Web.Services;

public interface ISecretService
{
    string GenerateSecret(int byteLength = 32);
    string HashSecret(string secret);
    bool VerifySecret(string hashedSecret, string providedSecret);
}

public sealed class SecretService : ISecretService
{
    private readonly PasswordHasher<object> _hasher = new();
    private static readonly object Subject = new();

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
}

