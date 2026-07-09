using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Tests;

public sealed class TenantPathBaseMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_rewrites_connect_path_without_setting_path_base()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var tenant = new Tenant { Name = "Demo", Slug = "demo", Status = TenantStatus.Active };
        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantPathBaseMiddleware(context =>
        {
            nextCalled = true;
            Assert.Equal(string.Empty, context.Request.PathBase.Value ?? string.Empty);
            Assert.Equal("/connect/authorize", context.Request.Path.Value);
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        context.Request.Path = "/demo/connect/authorize";

        await middleware.InvokeAsync(context, db);

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_rewrites_account_path_and_sets_path_base()
    {
        var currentTenant = new CurrentTenant();
        await using var db = CreateDbContext(currentTenant);
        var tenant = new Tenant { Name = "Demo", Slug = "demo", Status = TenantStatus.Active };
        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        var nextCalled = false;
        var middleware = new TenantPathBaseMiddleware(context =>
        {
            nextCalled = true;
            Assert.Equal("/demo", context.Request.PathBase.Value);
            Assert.Equal("/account/login", context.Request.Path.Value);
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        context.Request.Path = "/demo/account/login";

        await middleware.InvokeAsync(context, db);

        Assert.True(nextCalled);
    }

    private static ApplicationDbContext CreateDbContext(CurrentTenant currentTenant)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;
        return new ApplicationDbContext(options, currentTenant);
    }
}
