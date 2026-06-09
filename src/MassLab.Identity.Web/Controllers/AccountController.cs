using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Multitenancy;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace MassLab.Identity.Web.Controllers;

[Route("account")]
public sealed class AccountController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _db;
    private readonly ICurrentTenant _tenant;
    private readonly IAuditService _audit;
    private readonly IEmailService _email;
    private readonly ITotpService _totp;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ApplicationDbContext db,
        ICurrentTenant tenant,
        IAuditService audit,
        IEmailService email,
        ITotpService totp)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _db = db;
        _tenant = tenant;
        _audit = audit;
        _email = email;
        _totp = totp;
    }

    [HttpGet("login")]
    public IActionResult Login(string? returnUrl = null) => View(new LoginInput { ReturnUrl = returnUrl });

    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginInput input)
    {
        var user = await _userManager.FindByEmailAsync(input.Email);
        if (user is null || !user.IsEnabled)
        {
            await _audit.WriteAsync("login.failed", AuditResult.Failure, details: "Invalid user, tenant, or disabled account.");
            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return View(input);
        }

        if (!_tenant.IsAvailable)
        {
            if (!user.IsSystemAdmin)
            {
                await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), "Root host login is only allowed for system admins.");
                ModelState.AddModelError(string.Empty, "Tenant is not available.");
                return View(input);
            }
        }
        else
        {
            if (_tenant.Status != TenantStatus.Active || user.TenantId != _tenant.Id)
            {
                await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), "Invalid tenant or disabled tenant.");
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return View(input);
            }
        }

        var result = await _signInManager.PasswordSignInAsync(user, input.Password, input.RememberMe, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString());
            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return View(input);
        }

        _db.UserSessions.Add(new UserSession
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            SessionId = HttpContext.Session.Id,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = HttpContext.Request.Headers.UserAgent.ToString(),
            LastSeenAt = DateTimeOffset.UtcNow
        });
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("login.succeeded", AuditResult.Success, "user", user.Id.ToString());
        return LocalRedirect(input.ReturnUrl ?? "/");
    }

    [Authorize]
    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _audit.WriteAsync("logout", AuditResult.Success);
        await _signInManager.SignOutAsync();
        return RedirectToAction("Login");
    }

    [HttpGet("forgot-password")]
    public IActionResult ForgotPassword() => View(new ForgotPasswordInput());

    [HttpPost("forgot-password")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordInput input)
    {
        var user = await _userManager.FindByEmailAsync(input.Email);
        if (user is not null && user.TenantId == _tenant.Id)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var url = Url.ActionLink("ResetPassword", "Account", new { email = input.Email, token });
            await _email.QueuePasswordResetEmailAsync(input.Email, url ?? string.Empty);
            await _audit.WriteAsync("password_reset.requested", AuditResult.Success, "user", user.Id.ToString());
        }

        return View("EmailSent");
    }

    [HttpGet("reset-password")]
    public IActionResult ResetPassword(string email, string token) => View(new ResetPasswordInput { Email = email, Token = token });

    [HttpPost("reset-password")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(ResetPasswordInput input)
    {
        var user = await _userManager.FindByEmailAsync(input.Email);
        if (user is null || user.TenantId != _tenant.Id)
        {
            ModelState.AddModelError(string.Empty, "Invalid reset request.");
            return View(input);
        }

        var result = await _userManager.ResetPasswordAsync(user, input.Token, input.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(input);
        }

        await _audit.WriteAsync("password_reset.completed", AuditResult.Success, "user", user.Id.ToString());
        return RedirectToAction("Login");
    }

    [Authorize]
    [HttpGet("mfa/enroll")]
    public async Task<IActionResult> EnrollMfa()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            return Challenge();
        }

        user.TotpSecret ??= _totp.GenerateSecret();
        await _userManager.UpdateAsync(user);
        var uri = _totp.GetAuthenticatorUri("MassLab Identity", user.Email ?? user.UserName ?? user.Id.ToString(), user.TotpSecret);
        return View(new MfaEnrollViewModel(user.TotpSecret, uri));
    }

    [Authorize]
    [HttpPost("mfa/challenge")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> MfaChallenge(string code)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user?.TotpSecret is null || !_totp.VerifyCode(user.TotpSecret, code))
        {
            await _audit.WriteAsync("mfa.challenge", AuditResult.Failure);
            return View("MfaChallenge");
        }

        user.MfaEnabledByPolicy = true;
        await _userManager.UpdateAsync(user);
        await _audit.WriteAsync("mfa.challenge", AuditResult.Success, "user", user.Id.ToString());
        return RedirectToAction("Index", "Home");
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail(string email, string token)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || user.TenantId != _tenant.Id)
        {
            return BadRequest();
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        await _audit.WriteAsync("email_verification.completed", result.Succeeded ? AuditResult.Success : AuditResult.Failure, "user", user.Id.ToString());
        return result.Succeeded ? View("EmailVerified") : BadRequest();
    }

    [HttpGet("external/callback")]
    public IActionResult ExternalCallback() => View("ExternalCallback");

    [HttpGet("access-denied")]
    public IActionResult AccessDenied() => View();
}

public sealed record LoginInput
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public bool RememberMe { get; init; }
    public string? ReturnUrl { get; init; }
}

public sealed record ForgotPasswordInput
{
    public string Email { get; init; } = string.Empty;
}

public sealed record ResetPasswordInput
{
    public string Email { get; init; } = string.Empty;
    public string Token { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public sealed record MfaEnrollViewModel(string Secret, string AuthenticatorUri);
