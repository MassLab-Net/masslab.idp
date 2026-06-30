using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Web.Routing;
using MassLab.Identity.Web.ViewModels.SystemAdmin;
using MediatR;

namespace MassLab.Identity.Web.Controllers;

[Authorize(Policy = "system-admin")]
[Route("system-admin")]
public sealed class SystemAdminController : Controller
{
    private readonly ISender _sender;

    public SystemAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("")]
    [HttpGet("/admin/tenant/organizations", Name = AdminRouteNames.Organizations)]
    public async Task<IActionResult> Index() => View(await _sender.Send(new GetSystemTenantsQuery()));

    [HttpPost("tenants")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateTenant(CreateTenantInput input)
    {
        await _sender.Send(new CreateTenantCommand(input.Name, input.Slug, input.HostName));
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("tenants/{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleTenant(Guid id)
    {
        var result = await _sender.Send(new ToggleTenantCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }
}
