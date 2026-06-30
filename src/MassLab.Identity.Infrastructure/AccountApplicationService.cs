using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;

namespace MassLab.Identity.Infrastructure;

internal sealed class AccountApplicationService : IAccountQueries, IAccountCommands
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _db;
    private readonly ICurrentTenant _tenant;
    private readonly IAuditService _audit;
    private readonly IEmailService _email;
    private readonly ITotpService _totp;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly LinkGenerator _linkGenerator;

    public AccountApplicationService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ApplicationDbContext db,
        ICurrentTenant tenant,
        IAuditService audit,
        IEmailService email,
        ITotpService totp,
        IHttpContextAccessor httpContextAccessor,
        LinkGenerator linkGenerator)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _db = db;
        _tenant = tenant;
        _audit = audit;
        _email = email;
        _totp = totp;
        _httpContextAccessor = httpContextAccessor;
        _linkGenerator = linkGenerator;
    }

    public async Task<LoginResult> LoginAsync(string email, string password, bool rememberMe, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || !user.IsEnabled)
        {
            await _audit.WriteAsync("login.failed", AuditResult.Failure, details: "Invalid user, tenant, or disabled account.", cancellationToken: cancellationToken);
            return LoginResult.Failure("Invalid login attempt.");
        }

        if (!_tenant.IsAvailable)
        {
            if (!user.IsSystemAdmin)
            {
                await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), "Root host login is only allowed for system admins.", cancellationToken);
                return LoginResult.Failure("Tenant is not available.");
            }
        }
        else if (_tenant.Status != TenantStatus.Active || user.TenantId != _tenant.Id)
        {
            await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), "Invalid tenant or disabled tenant.", cancellationToken);
            return LoginResult.Failure("Invalid login attempt.");
        }

        var result = await _signInManager.PasswordSignInAsync(user, password, rememberMe, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), cancellationToken: cancellationToken);
            return LoginResult.Failure("Invalid login attempt.");
        }

        var httpContext = _httpContextAccessor.HttpContext;
        _db.UserSessions.Add(new UserSession
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            SessionId = httpContext?.Session.Id ?? string.Empty,
            IpAddress = httpContext?.Connection.RemoteIpAddress?.ToString(),
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString(),
            LastSeenAt = DateTimeOffset.UtcNow
        });
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("login.succeeded", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return LoginResult.Success();
    }

    public async Task LogoutAsync(CancellationToken cancellationToken = default)
    {
        await _audit.WriteAsync("logout", AuditResult.Success, cancellationToken: cancellationToken);
        await _signInManager.SignOutAsync();
    }

    public async Task RequestPasswordResetAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is not null && user.TenantId == _tenant.Id)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var httpContext = _httpContextAccessor.HttpContext;
            var url = _linkGenerator.GetUriByAction(
                httpContext!,
                action: "ResetPassword",
                controller: "Account",
                values: new { email, token });

            await _email.QueuePasswordResetEmailAsync(email, url ?? string.Empty, cancellationToken);
            await _audit.WriteAsync("password_reset.requested", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        }
    }

    public async Task<CommandResult> ResetPasswordAsync(string email, string token, string password, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || user.TenantId != _tenant.Id)
        {
            return CommandResult.Failure("Invalid reset request.");
        }

        var result = await _userManager.ResetPasswordAsync(user, token, password);
        if (!result.Succeeded)
        {
            return CommandResult.Failure(result.Errors.Select(error => error.Description));
        }

        await _audit.WriteAsync("password_reset.completed", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<MfaEnrollmentDto?> GetMfaEnrollmentAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user is null)
        {
            return null;
        }

        user.TotpSecret ??= _totp.GenerateSecret();
        await _userManager.UpdateAsync(user);
        var uri = _totp.GetAuthenticatorUri("MassLab Identity", user.Email ?? user.UserName ?? user.Id.ToString(), user.TotpSecret);
        return new MfaEnrollmentDto(user.TotpSecret, uri);
    }

    public async Task<CommandResult> VerifyMfaChallengeAsync(ClaimsPrincipal principal, string code, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user?.TotpSecret is null || !_totp.VerifyCode(user.TotpSecret, code))
        {
            await _audit.WriteAsync("mfa.challenge", AuditResult.Failure, cancellationToken: cancellationToken);
            return CommandResult.Failure("Invalid MFA code.");
        }

        user.MfaEnabledByPolicy = true;
        await _userManager.UpdateAsync(user);
        await _audit.WriteAsync("mfa.challenge", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<VerifyEmailResult> VerifyEmailAsync(string email, string token, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || user.TenantId != _tenant.Id)
        {
            return new VerifyEmailResult(false, false);
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        await _audit.WriteAsync("email_verification.completed", result.Succeeded ? AuditResult.Success : AuditResult.Failure, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return new VerifyEmailResult(true, result.Succeeded);
    }
}
