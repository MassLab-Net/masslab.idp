using System.Security.Claims;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Web.Controllers;

public sealed class ConnectController : Controller
{
    private readonly IRbacService _rbacService;

    public ConnectController(IRbacService rbacService)
    {
        _rbacService = rbacService;
    }

    [HttpGet("~/connect/authorize")]
    [HttpPost("~/connect/authorize")]
    [Authorize]
    public IActionResult AuthorizeEndpoint()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
            ?? throw new InvalidOperationException("OpenID Connect request is not available.");

        var identity = new ClaimsIdentity(
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
            Claims.Name,
            Claims.Role);

        foreach (var claim in User.Claims)
        {
            identity.AddClaim(claim);
        }

        identity.SetScopes(request.GetScopes());
        identity.SetResources("identity-api");
        return SignIn(new ClaimsPrincipal(identity), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

    [HttpGet("~/connect/userinfo")]
    [Authorize(AuthenticationSchemes = OpenIddictServerAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UserInfo()
    {
        var userId = User.FindFirstValue(Claims.Subject) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        var permissions = Guid.TryParse(userId, out var parsedUserId)
            ? await _rbacService.GetEffectivePermissionsAsync(parsedUserId)
            : Array.Empty<string>();

        return Ok(new
        {
            sub = userId,
            name = User.FindFirstValue("display_name") ?? User.Identity?.Name,
            email = User.FindFirstValue(ClaimTypes.Email),
            tenant_id = User.FindFirstValue("tenant_id"),
            permissions
        });
    }

    [HttpGet("~/connect/logout")]
    public async Task<IActionResult> LogoutEndpoint()
    {
        await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        return SignOut(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }
}
