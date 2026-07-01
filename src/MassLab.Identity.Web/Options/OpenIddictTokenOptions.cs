namespace MassLab.Identity.Web.Options;

public sealed class OpenIddictTokenOptions
{
    public const string SignedJwt = "SignedJwt";
    public const string EncryptedJwt = "EncryptedJwt";

    public string AccessTokenFormat { get; set; } = EncryptedJwt;
}
