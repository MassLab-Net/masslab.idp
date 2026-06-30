using System.Security.Claims;
using MassLab.Identity.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace MassLab.Identity.Infrastructure.Services;

public sealed class ApplicationClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole<Guid>>
{
    private readonly IRbacService _rbacService;

    public ApplicationClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        IOptions<IdentityOptions> options,
        IRbacService rbacService)
        : base(userManager, roleManager, options)
    {
        _rbacService = rbacService;
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        identity.AddClaim(new Claim("tenant_id", user.TenantId.ToString()));
        identity.AddClaim(new Claim("display_name", user.DisplayName));
        identity.AddClaim(new Claim("system_admin", user.IsSystemAdmin ? "true" : "false"));
        identity.AddClaim(new Claim("tenant_admin", user.IsTenantAdmin ? "true" : "false"));

        foreach (var permission in await _rbacService.GetEffectivePermissionsAsync(user.Id))
        {
            identity.AddClaim(new Claim("permission", permission));
        }

        return identity;
    }
}

