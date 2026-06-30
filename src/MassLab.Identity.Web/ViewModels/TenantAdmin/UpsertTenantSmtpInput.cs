namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class UpsertTenantSmtpInput
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public bool UseTls { get; set; }
    public string FromEmail { get; set; } = string.Empty;
    public string FromDisplayName { get; set; } = string.Empty;
}
