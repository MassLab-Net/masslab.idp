using MassLab.Identity.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure.Multitenancy;

public sealed class TenantPathBaseMiddleware
{
    private static readonly HashSet<string> TenantAwareRoots = new(StringComparer.OrdinalIgnoreCase)
    {
        "account",
        "connect"
    };

    private readonly RequestDelegate _next;

    public TenantPathBaseMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext db)
    {
        var path = context.Request.Path;
        if (!TryExtractTenantPrefix(path, out var tenantSlug, out var rewrittenPath))
        {
            await _next(context);
            return;
        }

        var tenant = await db.Tenants
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Slug == tenantSlug, context.RequestAborted);

        if (tenant is null)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        TenantRequestContext.SetResolvedTenant(context, tenant);
        context.Request.PathBase = context.Request.PathBase.Add($"/{tenantSlug}");
        context.Request.Path = rewrittenPath;

        await _next(context);
    }

    private static bool TryExtractTenantPrefix(PathString path, out string tenantSlug, out PathString rewrittenPath)
    {
        tenantSlug = string.Empty;
        rewrittenPath = path;

        var value = path.Value;
        if (string.IsNullOrWhiteSpace(value) || value == "/")
        {
            return false;
        }

        var segments = value.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length < 2 || !TenantAwareRoots.Contains(segments[1]))
        {
            return false;
        }

        tenantSlug = segments[0].Trim().ToLowerInvariant();
        rewrittenPath = new PathString("/" + string.Join('/', segments.Skip(1)));
        return !string.IsNullOrWhiteSpace(tenantSlug);
    }
}
