using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Features;
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
    public async Task<IActionResult> Index() => View(await _sender.Send(new GetSystemTenantsQuery()));

    [HttpPost("tenants")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateTenant(string name, string slug, string hostName)
    {
        await _sender.Send(new CreateTenantCommand(name, slug, hostName));
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
