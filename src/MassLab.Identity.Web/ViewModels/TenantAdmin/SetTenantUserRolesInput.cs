namespace MassLab.Identity.Web.ViewModels.TenantAdmin;

public sealed class SetTenantUserRolesInput
{
    public Guid[] RoleIds { get; set; } = Array.Empty<Guid>();
}
