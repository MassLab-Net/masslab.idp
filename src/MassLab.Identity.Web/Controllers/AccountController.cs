using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MediatR;

namespace MassLab.Identity.Web.Controllers;

[Route("account")]
public sealed class AccountController : Controller
{
    private readonly ISender _sender;

    public AccountController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("login")]
    public IActionResult Login(string? returnUrl = null) => View(new LoginInput { ReturnUrl = returnUrl });

    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginInput input)
    {
        var result = await _sender.Send(new LoginCommand(input.Email, input.Password, input.RememberMe));
        if (!result.Succeeded)
        {
            ModelState.AddModelError(string.Empty, result.ErrorMessage ?? "Invalid login attempt.");
            return View(input);
        }

        return LocalRedirect(input.ReturnUrl ?? "/");
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
    [HttpPost("mfa/challenge")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> MfaChallenge(string code)
    {
        var result = await _sender.Send(new VerifyMfaChallengeCommand(User, code));
        if (!result.Succeeded)
        {
            AddErrors(result);
            return View("MfaChallenge");
        }

        return RedirectToAction("Index", "Home");
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
    public IActionResult AccessDenied() => View();

    private void AddErrors(CommandResult result)
    {
        foreach (var error in result.Errors ?? Array.Empty<string>())
        {
            ModelState.AddModelError(string.Empty, error);
        }
    }
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
