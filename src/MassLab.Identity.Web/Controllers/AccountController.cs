using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure;
using MassLab.Identity.Infrastructure.Services;
using MassLab.Identity.Web.ViewModels.Account;
using MediatR;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.WebUtilities;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using System.Text.Json;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MassLab.Identity.Web.Controllers;

[Route("account")]
public sealed class AccountController : Controller
{
    private readonly ISender _sender;
    private readonly IOpenIddictApplicationManager _applications;
    private readonly ICurrentTenantAccessor _currentTenant;
    private readonly TenantClientIdFormatter _formatter;
    private static readonly string[] InvalidReturnUrlPrefixes =
    [
        "/account/logout",
        "/connect/logout"
    ];

    public AccountController(
        ISender sender,
        IOpenIddictApplicationManager applications,
        ICurrentTenantAccessor currentTenant,
        TenantClientIdFormatter formatter)
    {
        _sender = sender;
        _applications = applications;
        _currentTenant = currentTenant;
        _formatter = formatter;
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login(string? returnUrl = null)
    {
        var normalizedReturnUrl = NormalizeReturnUrl(returnUrl);
        var authorizeClientId = GetAuthorizeClientId(normalizedReturnUrl);
        if (!await IsValidAuthorizeReturnUrlAsync(normalizedReturnUrl, HttpContext.RequestAborted))
        {
            return View("InvalidClient", new InvalidClientViewModel
            {
                Tenant = Request.PathBase.Value?.Trim('/').ToLowerInvariant() ?? _currentTenant.Slug,
                ClientId = authorizeClientId
            });
        }

        if (User.Identity?.IsAuthenticated == true)
        {
            return LocalRedirect(normalizedReturnUrl ?? "/");
        }

        return View(new LoginInput
        {
            ReturnUrl = normalizedReturnUrl
        });
    }

    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginInput input)
    {
        var authorizeClientId = GetAuthorizeClientId(input.ReturnUrl);
        if (!await IsValidAuthorizeReturnUrlAsync(input.ReturnUrl, HttpContext.RequestAborted))
        {
            return View("InvalidClient", new InvalidClientViewModel
            {
                Tenant = Request.PathBase.Value?.Trim('/').ToLowerInvariant() ?? _currentTenant.Slug,
                ClientId = authorizeClientId
            });
        }

        var result = await _sender.Send(new LoginCommand(input.Email, input.Password, input.RememberMe));
        if (!result.Succeeded)
        {
            if (result.RequiresMfa)
            {
                return RedirectToAction(nameof(MfaChallenge), new { returnUrl = input.ReturnUrl });
            }
            ModelState.AddModelError(string.Empty, result.ErrorMessage ?? "Invalid login attempt.");
            return View(input);
        }

        return LocalRedirect(NormalizeReturnUrl(input.ReturnUrl) ?? "/");
    }

    [Authorize]
    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _sender.Send(new LogoutCommand());
        return RedirectToAction("Login");
    }

    [HttpGet("forgot-password")]
    public IActionResult ForgotPassword() => View(new ForgotPasswordInput());

    [HttpPost("forgot-password")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordInput input)
    {
        await _sender.Send(new RequestPasswordResetCommand(input.Email));
        return View("EmailSent");
    }

    [HttpGet("reset-password")]
    public IActionResult ResetPassword(string email, string token) => View(new ResetPasswordInput { Email = email, Token = token });

    [HttpPost("reset-password")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(ResetPasswordInput input)
    {
        var result = await _sender.Send(new ResetPasswordCommand(input.Email, input.Token, input.Password));
        if (!result.Succeeded)
        {
            AddErrors(result);
            return View(input);
        }

        return RedirectToAction("Login");
    }

    [Authorize]
    [HttpGet("mfa/enroll")]
    public async Task<IActionResult> EnrollMfa()
    {
        var enrollment = await _sender.Send(new GetMfaEnrollmentQuery(User));
        if (enrollment is null)
        {
            return Challenge();
        }

        return View(new MfaEnrollViewModel(enrollment.Secret, enrollment.AuthenticatorUri));
    }

    [Authorize]
    [Authorize(AuthenticationSchemes = MfaAuthenticationDefaults.PendingScheme)]
    [HttpGet("mfa/challenge")]
    public IActionResult MfaChallenge(string? returnUrl = null) => View(new MfaChallengeInput { ReturnUrl = NormalizeReturnUrl(returnUrl) });

    [Authorize(AuthenticationSchemes = MfaAuthenticationDefaults.PendingScheme)]
    [HttpPost("mfa/challenge")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> MfaChallenge(MfaChallengeInput input)
    {
        var result = await _sender.Send(new VerifyMfaChallengeCommand(User, input.Code));
        if (!result.Succeeded)
        {
            AddErrors(result);
            return View("MfaChallenge", input);
        }

        return LocalRedirect(NormalizeReturnUrl(input.ReturnUrl) ?? "/");
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail(string email, string token)
    {
        var result = await _sender.Send(new VerifyEmailCommand(email, token));
        if (!result.Found)
        {
            return BadRequest();
        }

        return result.Succeeded ? View("EmailVerified") : BadRequest();
    }

    [HttpGet("external/callback")]
    public IActionResult ExternalCallback() => View("ExternalCallback");

    [HttpGet("access-denied")]
    public IActionResult AccessDenied(string? returnUrl = null) => View(NormalizeReturnUrl(returnUrl));

    [Authorize]
    [HttpPost("switch-account")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SwitchAccount(string? returnUrl = null)
    {
        await _sender.Send(new LogoutCommand());
        return RedirectToAction(nameof(Login), new { returnUrl = NormalizeReturnUrl(returnUrl) });
    }

    [AllowAnonymous]
    [HttpGet("oidc-error")]
    public IActionResult OidcError()
    {
        var response = HttpContext.GetOpenIddictServerResponse();
        var statusCodeFeature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
        var tenant = Request.PathBase.Value?.Trim('/').ToLowerInvariant() ?? _currentTenant.Slug;
        var statusCode = statusCodeFeature?.OriginalStatusCode ?? HttpContext.Response.StatusCode;
        Response.StatusCode = statusCode;

        return View(new OidcErrorViewModel
        {
            StatusCode = statusCode,
            Tenant = string.IsNullOrWhiteSpace(tenant) ? null : tenant,
            Error = response?.Error,
            ErrorDescription = response?.ErrorDescription,
            ErrorUri = response?.ErrorUri
        });
    }

    private void AddErrors(CommandResult result)
    {
        foreach (var error in result.Errors ?? Array.Empty<string>())
        {
            ModelState.AddModelError(string.Empty, error);
        }
    }

    private static string? NormalizeReturnUrl(string? returnUrl)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
        {
            return null;
        }

        if (!returnUrl.StartsWith('/'))
        {
            return null;
        }

        var path = returnUrl.Split('?', '#')[0];
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        var offset = segments.Length > 0 &&
                     !segments[0].Equals("account", StringComparison.OrdinalIgnoreCase) &&
                     !segments[0].Equals("connect", StringComparison.OrdinalIgnoreCase)
            ? 1
            : 0;
        var normalizedPath = "/" + string.Join('/', segments.Skip(offset));

        foreach (var prefix in InvalidReturnUrlPrefixes)
        {
            if (normalizedPath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }
        }

        return returnUrl;
    }

    private async Task<bool> IsValidAuthorizeReturnUrlAsync(string? returnUrl, CancellationToken cancellationToken)
    {
        var clientId = GetAuthorizeClientId(returnUrl);
        if (string.IsNullOrWhiteSpace(clientId))
        {
            return true;
        }

        var lookupClientId = _currentTenant.Id.HasValue
            ? _formatter.FormatPhysicalClientId(_currentTenant.Id.Value, _formatter.NormalizeLogicalClientId(clientId))
            : clientId;

        var application = await _applications.FindByClientIdAsync(lookupClientId, cancellationToken);
        if (application is null)
        {
            return false;
        }

        var properties = await _applications.GetPropertiesAsync(application, cancellationToken);
        if (!IsEnabled(properties))
        {
            return false;
        }

        if (!_currentTenant.Id.HasValue)
        {
            return true;
        }

        return properties.TryGetValue(nameof(TenantEntity.TenantId), out var tenantElement) &&
               tenantElement.ValueKind == JsonValueKind.String &&
               Guid.TryParse(tenantElement.GetString(), out var tenantId) &&
               tenantId == _currentTenant.Id.Value;
    }

    private static string? GetAuthorizeClientId(string? returnUrl)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
        {
            return null;
        }

        if (!Uri.TryCreate($"https://local{returnUrl}", UriKind.Absolute, out var uri))
        {
            return null;
        }

        var path = uri.AbsolutePath;
        if (!path.Contains("/connect/authorize", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var query = QueryHelpers.ParseQuery(uri.Query);
        if (!query.TryGetValue(Parameters.ClientId, out var clientIdValues) || string.IsNullOrWhiteSpace(clientIdValues[0]))
        {
            return null;
        }

        return clientIdValues[0]!;
    }

    private static bool IsEnabled(IReadOnlyDictionary<string, JsonElement> properties)
        => properties.TryGetValue("Enabled", out var element) && element.ValueKind switch
        {
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.String => bool.TryParse(element.GetString(), out var value) && value,
            _ => false
        };
}
