namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class SetTenantUserAccessInput
{
    public Guid[] RoleIds { get; set; } = Array.Empty<Guid>();
    public Guid[] GrantedPermissionIds { get; set; } = Array.Empty<Guid>();
    public Guid[] DeniedPermissionIds { get; set; } = Array.Empty<Guid>();
}
