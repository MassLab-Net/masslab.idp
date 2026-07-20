using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Abstractions;
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
    private readonly ICurrentTenantAccessor _currentTenant;

    public SystemAdminApiController(ISender sender, ICurrentTenantAccessor currentTenant)
    {
        _sender = sender;
        _currentTenant = currentTenant;
    }

    [HttpGet("tenants")]
    public async Task<IActionResult> GetTenants()
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        return Ok(await _sender.Send(new GetSystemTenantsQuery()));
    }

    [HttpPost("tenants")]
    public async Task<IActionResult> CreateTenant(CreateTenantInput input)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        return ToActionResult(await _sender.Send(new CreateTenantCommand(
            input.Name,
            input.Slug,
            input.HostName,
            input.RootEmail,
            input.RootDisplayName,
            input.RootPassword)));
    }

    [HttpPost("tenants/{id:guid}/toggle")]
    public async Task<IActionResult> ToggleTenant(Guid id)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        return ToActionResult(await _sender.Send(new ToggleTenantCommand(id)));
    }

    [HttpDelete("tenants/{id:guid}")]
    public async Task<IActionResult> DeleteTenant(Guid id)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        return ToActionResult(await _sender.Send(new DeleteTenantCommand(id)));
    }

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

    private ActionResult ToActionResult(CreateTenantResult result)
    {
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    private bool CanManageOrganizations()
        => _currentTenant.IsAvailable && _currentTenant.IsSystemDefault;
}
