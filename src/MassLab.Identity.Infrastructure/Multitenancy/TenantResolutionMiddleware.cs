using MassLab.Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

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
        Domain.Tenant? tenant = TenantRequestContext.GetResolvedTenant(context);
        var requestedTenantWasExplicit = tenant is not null;

        if (tenant is null && !string.IsNullOrWhiteSpace(localhostTenant))
        {
            requestedTenantWasExplicit = true;
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == localhostTenant);
        }

        if (tenant is null && !string.IsNullOrWhiteSpace(formTenant))
        {
            requestedTenantWasExplicit = true;
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == formTenant);
        }

        if (tenant is null && !string.IsNullOrWhiteSpace(headerTenantSlug))
        {
            requestedTenantWasExplicit = true;
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Slug == headerTenantSlug);
        }

        if (tenant is null && Guid.TryParse(headerTenantId, out var parsedTenantIdFromHeader))
        {
            requestedTenantWasExplicit = true;
            tenant = await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == parsedTenantIdFromHeader);
        }

        tenant ??= await ResolveByHostAsync(db, host, configuredRoot);

        if (context.User.Identity?.IsAuthenticated == true)
        {
            var isSystemAdmin = string.Equals(
                context.User.FindFirstValue("system_admin"),
                "true",
                StringComparison.OrdinalIgnoreCase);

            var tenantIdClaim = context.User.FindFirstValue("tenant_id");
            var hasTenantClaim = Guid.TryParse(tenantIdClaim, out var claimedTenantId);

            if (!isSystemAdmin && hasTenantClaim)
            {
                if (tenant is not null && tenant.Id != claimedTenantId)
                {
                    if (TryResetAuthenticationForTenantLogin(context))
                    {
                        context.User = new ClaimsPrincipal(new ClaimsIdentity());
                        currentTenant.Set(tenant.Id, tenant.Slug, tenant.Status);
                        await _next(context);
                        return;
                    }

                    if (await TryRedirectToTenantLoginAsync(context))
                    {
                        return;
                    }

                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }

                if (requestedTenantWasExplicit && tenant is null)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }

                tenant ??= await db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == claimedTenantId);
            }
        }

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

    private static async Task<bool> TryRedirectToTenantLoginAsync(HttpContext context)
    {
        if (!HttpMethods.IsGet(context.Request.Method) ||
            !context.Request.Path.StartsWithSegments("/connect/authorize", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        ClearIdentityCookie(context);

        var tenantPrefix = GetTenantPrefix(context);
        var returnUrl = $"{tenantPrefix}{context.Request.Path}{context.Request.QueryString}";
        var loginPath = $"{tenantPrefix}/account/login";
        var redirectUrl = QueryHelpers.AddQueryString(loginPath, "returnUrl", returnUrl);
        context.Response.Redirect(redirectUrl);
        return true;
    }

    private static bool TryResetAuthenticationForTenantLogin(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments("/account/login", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        ClearIdentityCookie(context);
        return true;
    }

    private static void ClearIdentityCookie(HttpContext context)
    {
        var optionsMonitor = context.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>();
        var cookieOptions = optionsMonitor.Get(IdentityConstants.ApplicationScheme);
        var cookieName = cookieOptions.Cookie.Name;
        if (string.IsNullOrWhiteSpace(cookieName))
        {
            return;
        }

        context.Response.Cookies.Delete(cookieName, new CookieOptions
        {
            Path = "/"
        });

        if (context.Request.PathBase.HasValue)
        {
            context.Response.Cookies.Delete(cookieName, new CookieOptions
            {
                Path = context.Request.PathBase.Value
            });
        }
    }

    private static string GetTenantPrefix(HttpContext context)
    {
        if (context.Request.PathBase.HasValue)
        {
            return context.Request.PathBase.Value!;
        }

        var tenantSlug = TenantRequestContext.GetRouteTenantSlug(context);
        return string.IsNullOrWhiteSpace(tenantSlug)
            ? string.Empty
            : $"/{tenantSlug}";
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
