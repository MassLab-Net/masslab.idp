namespace MassLab.Identity.Web.Options;

public sealed class IdentityDataProtectionOptions
{
    public string? KeyRingPath { get; set; }
    public string ApplicationName { get; set; } = "MassLab.Identity";
}
