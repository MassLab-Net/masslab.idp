using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;

namespace MassLab.Identity.Web.Controllers.Api;

[ApiController]
[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
[Route("api/account/mfa")]
public sealed class AccountMfaApiController : ControllerBase
{
    private readonly ISender _sender;

    public AccountMfaApiController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<MfaStatusDto>> GetStatus()
    {
        var status = await _sender.Send(new GetMfaStatusQuery(User));
        return status is null ? Unauthorized() : Ok(status);
    }

    [HttpPost("enrollment")]
    public async Task<ActionResult<MfaEnrollmentDto>> GetEnrollment()
    {
        var enrollment = await _sender.Send(new GetMfaEnrollmentQuery(User));
        return enrollment is null ? Unauthorized() : Ok(enrollment);
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify(VerifyMfaInput input)
    {
        var result = await _sender.Send(new VerifyMfaChallengeCommand(User, input.Code));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("disable")]
    public async Task<IActionResult> Disable(VerifyMfaInput input)
    {
        var result = await _sender.Send(new DisableMfaCommand(User, input.Code));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("recovery-codes")]
    public async Task<ActionResult<MfaRecoveryCodesDto>> RegenerateRecoveryCodes()
    {
        var result = await _sender.Send(new RegenerateMfaRecoveryCodesCommand(User));
        return result is null ? BadRequest() : Ok(result);
    }
}

public sealed record VerifyMfaInput(string Code);
