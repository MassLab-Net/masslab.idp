using MassLab.Identity.Domain;

namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class CreateTenantClientInput
{
    public string Name { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public ClientType Type { get; set; }
    public string RedirectUri { get; set; } = string.Empty;
    public string Scopes { get; set; } = string.Empty;
    public string Flows { get; set; } = string.Empty;
}
