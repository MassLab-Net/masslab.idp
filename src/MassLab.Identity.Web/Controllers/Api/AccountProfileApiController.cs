using System.ComponentModel.DataAnnotations;
using MassLab.Identity.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;

namespace MassLab.Identity.Web.Controllers.Api;

[ApiController]
[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
[Route("api/account/profile")]
public sealed class AccountProfileApiController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountProfileApiController(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    [HttpGet]
    public async Task<ActionResult<AccountProfileDto>> Get()
    {
        var user = await _userManager.GetUserAsync(User);
        return user is null ? Unauthorized() : Ok(ToDto(user));
    }

    [HttpPut]
    public async Task<ActionResult<AccountProfileDto>> Update(UpdateAccountProfileInput input)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(input.DisplayName))
        {
            return BadRequest(new { errors = new[] { "Display name is required." } });
        }

        user.DisplayName = input.DisplayName.Trim();
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded ? Ok(ToDto(user)) : BadRequest(new { errors = result.Errors.Select(error => error.Description) });
    }

    [HttpPost("password")]
    public async Task<IActionResult> ChangePassword(ChangeAccountPasswordInput input)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        var result = await _userManager.ChangePasswordAsync(user, input.CurrentPassword, input.NewPassword);
        return result.Succeeded ? Ok(new { succeeded = true }) : BadRequest(new { errors = result.Errors.Select(error => error.Description) });
    }

    [HttpPut("recovery-email")]
    public async Task<ActionResult<AccountProfileDto>> UpdateRecoveryEmail(UpdateRecoveryEmailInput input)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        if (!IsValidEmail(input.Email)) return BadRequest(new { errors = new[] { "A valid recovery email is required." } });
        user.RecoveryEmail = input.Email.Trim();
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded ? Ok(ToDto(user)) : BadRequest(new { errors = result.Errors.Select(error => error.Description) });
    }

    private static AccountProfileDto ToDto(ApplicationUser user)
        => new(user.DisplayName, user.UserName ?? string.Empty, user.Email ?? string.Empty, user.RecoveryEmail);

    private static bool IsValidEmail(string? email) => !string.IsNullOrWhiteSpace(email) && new EmailAddressAttribute().IsValid(email);
}

public sealed record AccountProfileDto(string DisplayName, string UserName, string Email, string? RecoveryEmail);
public sealed record UpdateAccountProfileInput(string DisplayName);
public sealed record ChangeAccountPasswordInput(string CurrentPassword, string NewPassword);
public sealed record UpdateRecoveryEmailInput(string Email);
