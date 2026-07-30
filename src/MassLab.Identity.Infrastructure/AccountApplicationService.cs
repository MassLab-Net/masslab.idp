using System.Security.Claims;
using System.Security.Cryptography;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using System.Text.Json;

namespace MassLab.Identity.Infrastructure;

internal sealed class AccountApplicationService : IAccountQueries, IAccountCommands
{
    private const string RecoveryCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _db;
    private readonly ICurrentTenant _tenant;
    private readonly IAuditService _audit;
    private readonly IEmailService _email;
    private readonly ITotpService _totp;
    private readonly ISecretService _secrets;
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
        ISecretService secrets,
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
        _secrets = secrets;
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

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            if (result.IsNotAllowed && !user.EmailConfirmed)
            {
                await _audit.WriteAsync("login.email_unconfirmed", AuditResult.Failure, "user", user.Id.ToString(), cancellationToken: cancellationToken);
                return LoginResult.EmailVerificationRequired();
            }
            await _audit.WriteAsync("login.failed", AuditResult.Failure, "user", user.Id.ToString(), cancellationToken: cancellationToken);
            return LoginResult.Failure("Invalid login attempt.");
        }

        if (user.TwoFactorEnabled && !string.IsNullOrWhiteSpace(user.TotpSecret))
        {
            var context = _httpContextAccessor.HttpContext;
            if (context is null)
            {
                return LoginResult.Failure("MFA challenge could not be started.");
            }

            var pendingIdentity = new ClaimsIdentity(MfaAuthenticationDefaults.PendingScheme);
            pendingIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
            pendingIdentity.AddClaim(new Claim("remember_me", rememberMe ? "true" : "false"));
            await context.SignInAsync(MfaAuthenticationDefaults.PendingScheme, new ClaimsPrincipal(pendingIdentity), new AuthenticationProperties
            {
                IsPersistent = false,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(5)
            });
            await _audit.WriteAsync("mfa.challenge.required", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
            return LoginResult.RequiresMfaChallenge();
        }

        await CompleteSignInAsync(user, rememberMe, cancellationToken);
        await _audit.WriteAsync("login.succeeded", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return LoginResult.Success();
    }

    private async Task CompleteSignInAsync(ApplicationUser user, bool rememberMe, CancellationToken cancellationToken)
    {
        var sessionId = Guid.NewGuid();
        await _signInManager.SignInWithClaimsAsync(
            user,
            new AuthenticationProperties { IsPersistent = rememberMe },
            [
                new Claim("remember_me", rememberMe ? "true" : "false"),
                new Claim("sid", sessionId.ToString())
            ]);

        var httpContext = _httpContextAccessor.HttpContext;
        _db.UserSessions.Add(new UserSession
        {
            Id = sessionId,
            TenantId = user.TenantId,
            UserId = user.Id,
            SessionId = sessionId.ToString(),
            IpAddress = httpContext?.Connection.RemoteIpAddress?.ToString(),
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString(),
            LastSeenAt = DateTimeOffset.UtcNow
        });
        await _db.SaveChangesAsync(cancellationToken);
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

    public async Task<MfaStatusDto?> GetMfaStatusAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user is null)
        {
            return null;
        }

        return new MfaStatusDto(user.TwoFactorEnabled, GetRecoveryCodeHashes(user).Count, user.RecoveryEmail);
    }

    public async Task<CommandResult> VerifyMfaChallengeAsync(ClaimsPrincipal principal, string code, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user?.TotpSecret is null)
        {
            await _audit.WriteAsync("mfa.challenge", AuditResult.Failure, cancellationToken: cancellationToken);
            return CommandResult.Failure("Invalid MFA code.");
        }

        var verifiedWithTotp = _totp.VerifyCode(user.TotpSecret, code);
        if (!verifiedWithTotp && !TryUseRecoveryCode(user, code))
        {
            await _audit.WriteAsync("mfa.challenge", AuditResult.Failure, cancellationToken: cancellationToken);
            return CommandResult.Failure("Invalid MFA or recovery code.");
        }

        user.MfaEnabledByPolicy = true;
        user.TwoFactorEnabled = true;
        if (GetRecoveryCodeHashes(user).Count == 0)
        {
            SetRecoveryCodes(user, GenerateRecoveryCodes());
        }
        await _userManager.UpdateAsync(user);
        if (string.Equals(principal.Identity?.AuthenticationType, MfaAuthenticationDefaults.PendingScheme, StringComparison.Ordinal))
        {
            var rememberMe = string.Equals(principal.FindFirstValue("remember_me"), "true", StringComparison.OrdinalIgnoreCase);
            await CompleteSignInAsync(user, rememberMe, cancellationToken);
            await _httpContextAccessor.HttpContext!.SignOutAsync(MfaAuthenticationDefaults.PendingScheme);
            await _audit.WriteAsync("login.succeeded", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        }
        await _audit.WriteAsync("mfa.challenge", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DisableMfaAsync(ClaimsPrincipal principal, string code, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user?.TotpSecret is null || !_totp.VerifyCode(user.TotpSecret, code))
        {
            return CommandResult.Failure("Invalid MFA code.");
        }

        user.TwoFactorEnabled = false;
        user.MfaEnabledByPolicy = false;
        user.TotpSecret = null;
        user.RecoveryCodeHashesJson = null;
        await _userManager.UpdateAsync(user);
        await _audit.WriteAsync("mfa.disabled", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<MfaRecoveryCodesDto?> RegenerateMfaRecoveryCodesAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user is null || !user.TwoFactorEnabled)
        {
            return null;
        }

        var codes = GenerateRecoveryCodes();
        SetRecoveryCodes(user, codes);
        await _userManager.UpdateAsync(user);
        await _audit.WriteAsync("mfa.recovery_codes.regenerated", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return new MfaRecoveryCodesDto(codes);
    }

    private IReadOnlyCollection<string> GenerateRecoveryCodes()
        => Enumerable.Range(0, 10).Select(_ => GenerateRecoveryCode()).ToArray();

    private static string GenerateRecoveryCode()
    {
        var characters = new char[12];
        for (var index = 0; index < characters.Length; index++)
        {
            characters[index] = RecoveryCodeAlphabet[RandomNumberGenerator.GetInt32(RecoveryCodeAlphabet.Length)];
        }

        return new string(characters);
    }

    public async Task RequestEmailVerificationAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || user.TenantId != _tenant.Id || user.EmailConfirmed) return;
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var url = _linkGenerator.GetUriByAction(_httpContextAccessor.HttpContext!, "VerifyEmail", "Account", new { email, token });
        await _email.QueueVerificationEmailAsync(email, url ?? string.Empty, cancellationToken);
        await _audit.WriteAsync("email_verification.requested", AuditResult.Success, "user", user.Id.ToString(), cancellationToken: cancellationToken);
    }

    private void SetRecoveryCodes(ApplicationUser user, IReadOnlyCollection<string> codes)
        => user.RecoveryCodeHashesJson = JsonSerializer.Serialize(codes.Select(_secrets.HashSecret));

    private static IReadOnlyCollection<string> GetRecoveryCodeHashes(ApplicationUser user)
        => string.IsNullOrWhiteSpace(user.RecoveryCodeHashesJson)
            ? []
            : JsonSerializer.Deserialize<string[]>(user.RecoveryCodeHashesJson) ?? [];

    private bool TryUseRecoveryCode(ApplicationUser user, string code)
    {
        var hashes = GetRecoveryCodeHashes(user).ToList();
        var normalizedCode = code.Trim().ToUpperInvariant();
        var index = hashes.FindIndex(hash => _secrets.VerifySecret(hash, normalizedCode));
        if (index < 0)
        {
            return false;
        }

        hashes.RemoveAt(index);
        user.RecoveryCodeHashesJson = JsonSerializer.Serialize(hashes);
        return true;
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
