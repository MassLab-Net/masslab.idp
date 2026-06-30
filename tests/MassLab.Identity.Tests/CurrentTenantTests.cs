using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;

namespace MassLab.Identity.Tests;

public sealed class CurrentTenantTests
{
    [Fact]
    public void Set_updates_tenant_context()
    {
        var tenantId = Guid.NewGuid();
        var currentTenant = new CurrentTenant();

        currentTenant.Set(tenantId, "demo", TenantStatus.Active);

        Assert.True(currentTenant.IsAvailable);
        Assert.Equal(tenantId, currentTenant.Id);
        Assert.Equal("demo", currentTenant.Slug);
        Assert.Equal(TenantStatus.Active, currentTenant.Status);
    }
}

