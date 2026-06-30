namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class EditTenantPermissionInput
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
}
