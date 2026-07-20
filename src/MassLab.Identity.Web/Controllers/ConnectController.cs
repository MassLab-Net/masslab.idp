using System.Security.Claims;
using OpenIddict.Validation.AspNetCore;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Application.Abstractions;
using MediatR;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using Microsoft.Extensions.Options;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Web.Controllers;

public sealed class ConnectController : Controller
{
    private static readonly string[] LegacyCookieNames =
    [
        "masslab.identity.sso"
    ];

    private readonly ISender _sender;
    private readonly ICurrentTenantAccessor _currentTenant;

    public ConnectController(ISender sender, ICurrentTenantAccessor currentTenant)
    {
        _sender = sender;
        _currentTenant = currentTenant;
    }

    [HttpGet("~/connect/authorize")]
    [HttpPost("~/connect/authorize")]
    [Authorize]
    public IActionResult AuthorizeEndpoint()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
            ?? throw new InvalidOperationException("OpenID Connect request is not available.");
        var scopes = request.GetScopes().ToHashSet(StringComparer.Ordinal);
        var effectiveTenantId = ResolveEffectiveTenantId();

        var identity = new ClaimsIdentity(
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
            Claims.Name,
            Claims.Role);

        var subject = User.FindFirstValue(Claims.Subject) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(subject))
        {
            throw new InvalidOperationException("Authenticated user does not contain a subject identifier.");
        }

        identity.SetClaim(Claims.Subject, subject);
        if (!string.IsNullOrWhiteSpace(effectiveTenantId))
        {
            identity.SetClaim("tenant_id", effectiveTenantId);
        }

        foreach (var claim in User.Claims)
        {
            if (claim.Type == Claims.Subject || claim.Type == "tenant_id")
            {
                continue;
            }

            var clone = new Claim(claim.Type, claim.Value, claim.ValueType, claim.Issuer, claim.OriginalIssuer);
            clone.SetDestinations(GetDestinations(clone, scopes));
            identity.AddClaim(clone);
        }

        identity.SetScopes(request.GetScopes());
        identity.SetResources("identity-api");
        identity.SetDestinations(claim => GetDestinations(claim, scopes));
        return SignIn(new ClaimsPrincipal(identity), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

    [HttpGet("~/connect/userinfo")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UserInfo()
    {
        var result = await _sender.Send(new GetUserInfoQuery(User));

        return Ok(new
        {
            sub = result.Subject,
            name = result.Name,
            email = result.Email,
            tenant_id = result.TenantId,
            tenant_name = result.TenantName,
            is_system_default_tenant = result.IsSystemDefaultTenant,
            system_admin = result.IsSystemAdmin,
            tenant_admin = result.IsTenantAdmin,
            remember_me = result.RememberMe,
            permissions = result.Permissions
        });
    }

    [HttpGet("~/connect/logout")]
    public async Task<IActionResult> LogoutEndpoint()
    {
        await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        ClearIdentityCookies();
        return SignOut(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

    private void ClearIdentityCookies()
    {
        var optionsMonitor = HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>();
        var cookieOptions = optionsMonitor.Get(IdentityConstants.ApplicationScheme);
        var cookieName = cookieOptions.Cookie.Name;
        if (string.IsNullOrWhiteSpace(cookieName))
        {
            return;
        }

        foreach (var name in EnumerateCookieNames(cookieName))
        {
            Response.Cookies.Delete(name, new CookieOptions
            {
                Path = "/"
            });

            var tenantSlug = _currentTenant.Slug;
            if (!string.IsNullOrWhiteSpace(tenantSlug))
            {
                Response.Cookies.Delete(name, new CookieOptions
                {
                    Path = $"/{tenantSlug}"
                });
            }
        }
    }

    private static IEnumerable<string> EnumerateCookieNames(string currentCookieName)
    {
        yield return currentCookieName;

        foreach (var legacyCookieName in LegacyCookieNames)
        {
            if (!string.Equals(legacyCookieName, currentCookieName, StringComparison.Ordinal))
            {
                yield return legacyCookieName;
            }
        }
    }

    private static IEnumerable<string> GetDestinations(Claim claim, ISet<string> scopes)
    {
        switch (claim.Type)
        {
            case Claims.Subject:
                return [Destinations.AccessToken, Destinations.IdentityToken];
            case Claims.Name:
            case ClaimTypes.Name:
            case "display_name":
                return scopes.Contains(Scopes.Profile)
                    ? [Destinations.AccessToken, Destinations.IdentityToken]
                    : [Destinations.AccessToken];
            case Claims.Email:
            case ClaimTypes.Email:
                return scopes.Contains(Scopes.Email)
                    ? [Destinations.AccessToken, Destinations.IdentityToken]
                    : [Destinations.AccessToken];
            case ClaimTypes.Role:
            case Claims.Role:
            case "tenant_id":
            case "system_admin":
            case "tenant_admin":
            case "remember_me":
            case "sid":
            case "authorization_version":
                return [Destinations.AccessToken];
            case "permission":
                return scopes.Contains("permissions")
                    ? [Destinations.AccessToken]
                    : [];
            case "AspNet.Identity.SecurityStamp":
                return [];
            default:
                return [Destinations.AccessToken];
        }
    }

    private string? ResolveEffectiveTenantId()
    {
        if (_currentTenant.Id.HasValue)
        {
            return _currentTenant.Id.Value.ToString();
        }

        return User.FindFirstValue("tenant_id");
    }
}
