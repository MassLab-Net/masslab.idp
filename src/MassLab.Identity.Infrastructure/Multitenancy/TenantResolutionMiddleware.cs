using MassLab.Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MassLab.Identity.Infrastructure.Multitenancy;

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
        var formTenant = context.Request.HasFormContentType
            ? context.Request.Form["Tenant"].FirstOrDefault() ?? context.Request.Form["tenant"].FirstOrDefault()
            : null;
        var headerTenantSlug = context.Request.Headers["X-Tenant-Slug"].FirstOrDefault();
        var headerTenantId = context.Request.Headers["X-Tenant-Id"].FirstOrDefault();
        Domain.Tenant? tenant = null;

        if (!string.IsNullOrWhiteSpace(localhostTenant))
        {
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == localhostTenant);
        }

        if (tenant is null && !string.IsNullOrWhiteSpace(formTenant))
        {
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == formTenant);
        }

        if (tenant is null && !string.IsNullOrWhiteSpace(headerTenantSlug))
        {
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == headerTenantSlug);
        }

        if (tenant is null && Guid.TryParse(headerTenantId, out var parsedTenantIdFromHeader))
        {
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == parsedTenantIdFromHeader);
        }

        tenant ??= await ResolveByHostAsync(db, host, configuredRoot);

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
