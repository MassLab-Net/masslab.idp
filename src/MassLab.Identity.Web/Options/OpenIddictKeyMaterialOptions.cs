namespace MassLab.Identity.Web.Options;

public sealed class OpenIddictKeyMaterialOptions
{
    public string? SigningCertificatePath { get; set; }
    public string? SigningCertificatePassword { get; set; }
    public string? EncryptionCertificatePath { get; set; }
    public string? EncryptionCertificatePassword { get; set; }
}
