using MassLab.Identity.Domain;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class EditTenantClientInput
{
    public string Name { get; set; } = string.Empty;
    public ClientType Type { get; set; }
    public string[] RedirectUris { get; set; } = Array.Empty<string>();
    public string[] PostLogoutRedirectUris { get; set; } = Array.Empty<string>();
    public string Scopes { get; set; } = string.Empty;
    public string Flows { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}
