namespace MassLab.Identity.Web.ViewModels.SystemAdmin;

public sealed class CreateTenantInput
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string HostName { get; set; } = string.Empty;
}
