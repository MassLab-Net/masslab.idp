using System.Security.Cryptography;

namespace MassLab.Identity.Web.Services;

public interface ITotpService
{
    string GenerateSecret();
    string GetAuthenticatorUri(string issuer, string accountName, string secret);
    bool VerifyCode(string secret, string code);
}

public sealed class TotpService : ITotpService
{
    public string GenerateSecret()
    {
        var bytes = RandomNumberGenerator.GetBytes(20);
        return Base32Encode(bytes);
    }

    public string GetAuthenticatorUri(string issuer, string accountName, string secret)
        => $"otpauth://totp/{Uri.EscapeDataString(issuer)}:{Uri.EscapeDataString(accountName)}?secret={secret}&issuer={Uri.EscapeDataString(issuer)}";

    public bool VerifyCode(string secret, string code)
    {
        if (string.IsNullOrWhiteSpace(secret) || string.IsNullOrWhiteSpace(code))
        {
            return false;
        }

        var current = GenerateCode(secret, DateTimeOffset.UtcNow);
        var previous = GenerateCode(secret, DateTimeOffset.UtcNow.AddSeconds(-30));
        var next = GenerateCode(secret, DateTimeOffset.UtcNow.AddSeconds(30));
        return code == current || code == previous || code == next;
    }

    private static string GenerateCode(string secret, DateTimeOffset timestamp)
    {
        var key = Base32Decode(secret);
        var timestep = BitConverter.GetBytes(timestamp.ToUnixTimeSeconds() / 30);
        if (BitConverter.IsLittleEndian)
        {
            Array.Reverse(timestep);
        }

        using var hmac = new HMACSHA1(key);
        var hash = hmac.ComputeHash(timestep);
        var offset = hash[^1] & 0x0f;
        var binary = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);
        return (binary % 1_000_000).ToString("D6");
    }

    private static string Base32Encode(byte[] bytes)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var output = new System.Text.StringBuilder();
        var bits = 0;
        var value = 0;

        foreach (var b in bytes)
        {
            value = (value << 8) | b;
            bits += 8;
            while (bits >= 5)
            {
                output.Append(alphabet[(value >> (bits - 5)) & 31]);
                bits -= 5;
            }
        }

        if (bits > 0)
        {
            output.Append(alphabet[(value << (5 - bits)) & 31]);
        }

        return output.ToString();
    }

    private static byte[] Base32Decode(string input)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var cleaned = input.TrimEnd('=').ToUpperInvariant();
        var bytes = new List<byte>();
        var bits = 0;
        var value = 0;

        foreach (var c in cleaned)
        {
            var index = alphabet.IndexOf(c);
            if (index < 0)
            {
                continue;
            }

            value = (value << 5) | index;
            bits += 5;
            if (bits >= 8)
            {
                bytes.Add((byte)((value >> (bits - 8)) & 255));
                bits -= 8;
            }
        }

        return bytes.ToArray();
    }
}

