using Microsoft.AspNetCore.Identity;

namespace MassLab.Identity.Domain;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public Guid TenantId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public bool IsSystemAdmin { get; set; }
    public bool IsTenantAdmin { get; set; }
    public bool MfaEnabledByPolicy { get; set; }
    public string? TotpSecret { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<UserRoleAssignment> RoleAssignments { get; set; } = new List<UserRoleAssignment>();
    public ICollection<UserExternalLoginLink> ExternalLogins { get; set; } = new List<UserExternalLoginLink>();
}
