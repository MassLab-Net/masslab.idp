namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class SetTenantRolePermissionsInput
{
    public Guid[] PermissionIds { get; set; } = Array.Empty<Guid>();
}
