namespace MassLab.Identity.Web.Domain;

public sealed class TenantRole : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<UserRoleAssignment> UserAssignments { get; set; } = new List<UserRoleAssignment>();
    public ICollection<RolePermissionAssignment> PermissionAssignments { get; set; } = new List<RolePermissionAssignment>();
}

public sealed class TenantPermission : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
}

public sealed class UserRoleAssignment
{
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid RoleId { get; set; }
    public TenantRole? Role { get; set; }
    public Guid TenantId { get; set; }
}

public sealed class RolePermissionAssignment
{
    public Guid RoleId { get; set; }
    public TenantRole? Role { get; set; }
    public Guid PermissionId { get; set; }
    public TenantPermission? Permission { get; set; }
    public Guid TenantId { get; set; }
}
