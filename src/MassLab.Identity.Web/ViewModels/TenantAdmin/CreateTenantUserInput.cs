namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class CreateTenantUserInput
{
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool IsTenantAdmin { get; set; }
}
