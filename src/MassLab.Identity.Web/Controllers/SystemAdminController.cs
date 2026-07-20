using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Abstractions;
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
    private readonly ICurrentTenantAccessor _currentTenant;

    public SystemAdminController(ISender sender, ICurrentTenantAccessor currentTenant)
    {
        _sender = sender;
        _currentTenant = currentTenant;
    }

    [HttpGet("")]
    [HttpGet("/admin/tenant/organizations", Name = AdminRouteNames.Organizations)]
    public async Task<IActionResult> Index()
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        return View(await _sender.Send(new GetSystemTenantsQuery()));
    }

    [HttpPost("tenants")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateTenant(CreateTenantInput input)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        var result = await _sender.Send(new CreateTenantCommand(
            input.Name,
            input.Slug,
            input.HostName,
            input.RootEmail,
            input.RootDisplayName,
            input.RootPassword));
        if (!result.Succeeded)
        {
            TempData["CreateTenantError"] = string.Join(" ", result.Errors ?? []);
            return RedirectToAction(nameof(Index));
        }

        TempData["CreateTenantRootEmail"] = result.RootEmail;
        TempData["CreateTenantRootPassword"] = result.RootPassword;
        TempData["CreateTenantPasswordGenerated"] = result.PasswordGenerated;
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("tenants/{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleTenant(Guid id)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        var result = await _sender.Send(new ToggleTenantCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    [HttpPost("tenants/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteTenant(Guid id)
    {
        if (!CanManageOrganizations())
        {
            return Forbid();
        }

        var result = await _sender.Send(new DeleteTenantCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        if (!result.Succeeded)
        {
            TempData["CreateTenantError"] = string.Join(" ", result.Errors ?? []);
        }

        return RedirectToAction(nameof(Index));
    }

    private bool CanManageOrganizations()
        => _currentTenant.IsAvailable && _currentTenant.IsSystemDefault;
}
