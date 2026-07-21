using System.Security.Claims;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace MassLab.Identity.Tests;

public sealed class TenantResolutionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_ignores_legacy_query_tenant_for_authenticated_tenant_user()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var firstTenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        var secondTenant = new Tenant { Name = "Second", Slug = "second", Status = TenantStatus.Active };
        db.Tenants.AddRange(firstTenant, secondTenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantResolutionMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(allowTenantHeaders: true);
        context.Request.QueryString = new QueryString("?tenant=second");
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", firstTenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.True(nextCalled);
        Assert.Equal(firstTenant.Id, currentTenant.Id);
        Assert.Equal("first", currentTenant.Slug);
        Assert.Equal(TenantStatus.Active, currentTenant.Status);
    }

    [Fact]
    public async Task InvokeAsync_redirects_authorize_request_to_tenant_login_for_authenticated_user_with_mismatched_tenant()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var firstTenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        var secondTenant = new Tenant { Name = "Second", Slug = "second", Status = TenantStatus.Active };
        db.Tenants.AddRange(firstTenant, secondTenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantResolutionMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(allowTenantHeaders: true);
        context.Request.Method = HttpMethods.Get;
        context.Request.PathBase = new PathString("/second");
        context.Request.Path = new PathString("/connect/authorize");
        context.Request.QueryString = new QueryString("?client_id=masslab-admin-spa");
        context.Request.Headers["X-Tenant-Slug"] = "second";
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", firstTenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.Equal(StatusCodes.Status302Found, context.Response.StatusCode);
        Assert.Equal(
            "/second/account/login?returnUrl=%2Fsecond%2Fconnect%2Fauthorize%3Fclient_id%3Dmasslab-admin-spa",
            context.Response.Headers.Location.ToString());
        Assert.False(nextCalled);
        Assert.False(currentTenant.IsAvailable);
    }

    [Fact]
    public async Task InvokeAsync_allows_tenant_login_request_by_clearing_mismatched_authenticated_user()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var firstTenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        var secondTenant = new Tenant { Name = "Second", Slug = "second", Status = TenantStatus.Active };
        db.Tenants.AddRange(firstTenant, secondTenant);
        await db.SaveChangesAsync();

        ClaimsPrincipal? principalSeenByNext = null;
        var nextCalled = false;
        var middleware = new TenantResolutionMiddleware(context =>
        {
            nextCalled = true;
            principalSeenByNext = context.User;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(allowTenantHeaders: true);
        context.Request.Method = HttpMethods.Get;
        context.Request.PathBase = new PathString("/second");
        context.Request.Path = new PathString("/account/login");
        context.Request.Headers["X-Tenant-Slug"] = "second";
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", firstTenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.True(nextCalled);
        Assert.NotNull(principalSeenByNext);
        Assert.False(principalSeenByNext!.Identity?.IsAuthenticated ?? true);
        Assert.Equal(secondTenant.Id, currentTenant.Id);
        Assert.Equal("second", currentTenant.Slug);
        Assert.Equal(TenantStatus.Active, currentTenant.Status);
    }

    [Fact]
    public async Task InvokeAsync_rejects_unknown_explicit_tenant_for_authenticated_tenant_user()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var tenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantResolutionMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext(allowTenantHeaders: true);
        context.Request.Headers["X-Tenant-Slug"] = "missing";
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", tenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
        Assert.False(nextCalled);
        Assert.False(currentTenant.IsAvailable);
    }

    [Fact]
    public async Task InvokeAsync_falls_back_to_user_tenant_when_request_does_not_specify_one()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var tenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantResolutionMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = CreateHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", tenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.True(nextCalled);
        Assert.Equal(tenant.Id, currentTenant.Id);
        Assert.Equal("first", currentTenant.Slug);
        Assert.Equal(TenantStatus.Active, currentTenant.Status);
    }

    [Fact]
    public async Task InvokeAsync_falls_back_to_system_admin_tenant_when_request_does_not_specify_one()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var tenant = new Tenant { Name = "System", Slug = "system", IsSystemDefault = true, Status = TenantStatus.Active };
        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        var middleware = new TenantResolutionMiddleware(_ => Task.CompletedTask);
        var context = CreateHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", tenant.Id.ToString()),
            new Claim("system_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.Equal(tenant.Id, currentTenant.Id);
        Assert.Equal("system", currentTenant.Slug);
        Assert.True(currentTenant.IsSystemDefault);
    }

    [Fact]
    public async Task InvokeAsync_ignores_tenant_headers_by_default()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var firstTenant = new Tenant { Name = "First", Slug = "first", Status = TenantStatus.Active };
        var secondTenant = new Tenant { Name = "Second", Slug = "second", Status = TenantStatus.Active };
        db.Tenants.AddRange(firstTenant, secondTenant);
        await db.SaveChangesAsync();

        var middleware = new TenantResolutionMiddleware(_ => Task.CompletedTask);
        var context = CreateHttpContext();
        context.Request.Headers["X-Tenant-Slug"] = "second";
        context.User = new ClaimsPrincipal(new ClaimsIdentity([new Claim("tenant_id", firstTenant.Id.ToString())], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.Equal(firstTenant.Id, currentTenant.Id);
    }

    [Fact]
    public async Task Tenant_path_base_middleware_does_not_treat_api_account_routes_as_tenant_routes()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var nextCalled = false;
        var middleware = new TenantPathBaseMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var context = CreateHttpContext();
        context.Request.Path = "/api/account/mfa";

        await middleware.InvokeAsync(context, db);

        Assert.True(nextCalled);
        Assert.Equal("/api/account/mfa", context.Request.Path.Value);
    }

    private static DefaultHttpContext CreateHttpContext(bool allowTenantHeaders = false)
    {
        var context = new DefaultHttpContext();
        var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Multitenancy:AllowTenantHeaders"] = allowTenantHeaders.ToString()
            })
            .Build());
        services.AddOptions();
        services.AddAuthentication()
            .AddCookie(IdentityConstants.ApplicationScheme, options => options.Cookie.Name = "masslab.identity.sso");
        services.AddSingleton<IConfigureOptions<CookieAuthenticationOptions>>(
            new ConfigureNamedOptions<CookieAuthenticationOptions>(
                IdentityConstants.ApplicationScheme,
                options => options.Cookie.Name = "masslab.identity.sso"));
        context.RequestServices = services.BuildServiceProvider();
        return context;
    }

    private static ApplicationDbContext CreateDbContext(CurrentTenant currentTenant)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;
        return new ApplicationDbContext(options, currentTenant);
    }
}
