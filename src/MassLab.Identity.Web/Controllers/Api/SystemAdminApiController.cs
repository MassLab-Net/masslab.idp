using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Web.ViewModels.SystemAdmin;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;

namespace MassLab.Identity.Web.Controllers.Api;

[ApiController]
[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme, Policy = "system-admin")]
[Route("api/admin/system")]
public sealed class SystemAdminApiController : ControllerBase
{
    private readonly ISender _sender;

    public SystemAdminApiController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("tenants")]
    public async Task<IActionResult> GetTenants()
        => Ok(await _sender.Send(new GetSystemTenantsQuery()));

    [HttpPost("tenants")]
    public async Task<IActionResult> CreateTenant(CreateTenantInput input)
    {
        await _sender.Send(new CreateTenantCommand(input.Name, input.Slug, input.HostName));
        return NoContent();
    }

    [HttpPost("tenants/{id:guid}/toggle")]
    public async Task<IActionResult> ToggleTenant(Guid id)
        => ToActionResult(await _sender.Send(new ToggleTenantCommand(id)));

    private ActionResult ToActionResult(CommandResult result)
    {
        if (result.NotFound)
        {
            return NotFound(result);
        }

        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
