namespace MassLab.Identity.Infrastructure.Data;

public sealed class OpenIddictAdminSpaClientOptions
{
    public bool Enabled { get; set; } = true;
    public string ClientId { get; set; } = "masslab-admin-spa";
    public string DisplayName { get; set; } = "MassLab Admin";
    public string[] RedirectUris { get; set; } = Array.Empty<string>();
    public string[] PostLogoutRedirectUris { get; set; } = Array.Empty<string>();
}
