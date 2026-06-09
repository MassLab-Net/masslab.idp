using MassLab.Identity.Web.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MassLab.Identity.Web.Multitenancy;

public sealed class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext db, ICurrentTenant currentTenant)
    {
        var host = context.Request.Host.Host.ToLowerInvariant();
        var configuredRoot = context.RequestServices
            .GetRequiredService<IConfiguration>()
            .GetValue<string>("Multitenancy:RootDomain")?
            .ToLowerInvariant();

        var localhostTenant = context.Request.Query["tenant"].FirstOrDefault();
        var tenant = !string.IsNullOrWhiteSpace(localhostTenant)
            ? await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == localhostTenant)
            : await ResolveByHostAsync(db, host, configuredRoot);

        if (tenant is null)
        {
            var tenantIdClaim = context.User.FindFirstValue("tenant_id");
            if (Guid.TryParse(tenantIdClaim, out var tenantId))
            {
                tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == tenantId);
            }
        }

        if (tenant is not null)
        {
            currentTenant.Set(tenant.Id, tenant.Slug, tenant.Status);
        }

        await _next(context);
    }

    private static async Task<Domain.Tenant?> ResolveByHostAsync(ApplicationDbContext db, string host, string? rootDomain)
    {
        var byDomain = await db.TenantDomains
            .IgnoreQueryFilters()
            .Include(x => x.Tenant)
            .FirstOrDefaultAsync(x => x.HostName == host);

        if (byDomain?.Tenant is not null)
        {
            return byDomain.Tenant;
        }

        if (!string.IsNullOrWhiteSpace(rootDomain) && host.EndsWith($".{rootDomain}", StringComparison.Ordinal))
        {
            var slug = host[..^($".{rootDomain}".Length)];
            return await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == slug);
        }

        return null;
    }
}
