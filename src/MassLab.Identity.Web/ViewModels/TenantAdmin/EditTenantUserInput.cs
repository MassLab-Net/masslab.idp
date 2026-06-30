namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class EditTenantUserInput
{
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public bool IsTenantAdmin { get; set; }
}
