using MassLab.Identity.Domain;
using Microsoft.AspNetCore.Http;

namespace MassLab.Identity.Infrastructure.Multitenancy;

internal static class TenantRequestContext
{
    private const string ResolvedTenantKey = "__MassLab.ResolvedTenant";
    private const string RouteTenantSlugKey = "__MassLab.RouteTenantSlug";

    public static void SetResolvedTenant(HttpContext context, Tenant tenant)
    {
        context.Items[ResolvedTenantKey] = tenant;
        context.Items[RouteTenantSlugKey] = tenant.Slug;
    }

    public static Tenant? GetResolvedTenant(HttpContext context)
        => context.Items.TryGetValue(ResolvedTenantKey, out var value) ? value as Tenant : null;

    public static string? GetRouteTenantSlug(HttpContext context)
        => context.Items.TryGetValue(RouteTenantSlugKey, out var value) ? value as string : null;
}
