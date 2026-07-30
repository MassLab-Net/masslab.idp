using MassLab.Identity.Domain;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class UpsertTenantSmtpInput
{
    public TenantEmailProvider Provider { get; set; } = TenantEmailProvider.Smtp;
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public bool UseTls { get; set; }
    public string FromEmail { get; set; } = string.Empty;
    public string FromDisplayName { get; set; } = string.Empty;
    public string? ResendApiKey { get; set; }
    public string? SesRegion { get; set; }
    public string? SesAccessKey { get; set; }
    public string? SesSecretKey { get; set; }
    public string? SesConfigurationSetName { get; set; }
    public string PasswordResetTemplate { get; set; } = "identity-password-reset";
    public string EmailVerificationTemplate { get; set; } = "identity-email-verification";
}
