using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Web.Controllers;

[Authorize(Policy = "system-admin")]
[Route("system-admin")]
public sealed class SystemAdminController : Controller
{
    private readonly ApplicationDbContext _db;

    public SystemAdminController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var tenants = await _db.Tenants.IgnoreQueryFilters().OrderBy(x => x.Name).ToListAsync();
        return View(tenants);
    }

    [HttpPost("tenants")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateTenant(string name, string slug, string hostName)
    {
        var tenant = new Tenant { Name = name, Slug = slug, Status = TenantStatus.Active };
        _db.Tenants.Add(tenant);
        _db.TenantDomains.Add(new TenantDomain { TenantId = tenant.Id, HostName = hostName, IsPrimary = true });
        _db.TenantDefaultPolicies.Add(new TenantDefaultPolicy { TenantId = tenant.Id });
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("tenants/{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleTenant(Guid id)
    {
        var tenant = await _db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id);
        if (tenant is null)
        {
            return NotFound();
        }

        tenant.Status = tenant.Status == TenantStatus.Active ? TenantStatus.Disabled : TenantStatus.Active;
        tenant.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}

