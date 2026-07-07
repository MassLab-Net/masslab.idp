using System.Security.Claims;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MassLab.Identity.Tests;

public sealed class TenantResolutionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_rejects_explicit_mismatched_tenant_for_authenticated_tenant_user()
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

        var context = CreateHttpContext();
        context.Request.QueryString = new QueryString("?tenant=second");
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim("tenant_id", firstTenant.Id.ToString()),
            new Claim("tenant_admin", "true")
        ], "test"));

        await middleware.InvokeAsync(context, db, currentTenant);

        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
        Assert.False(nextCalled);
        Assert.False(currentTenant.IsAvailable);
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

        var context = CreateHttpContext();
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

    private static DefaultHttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        var services = new ServiceCollection()
            .AddSingleton<IConfiguration>(new ConfigurationBuilder().Build())
            .BuildServiceProvider();
        context.RequestServices = services;
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
