using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Multitenancy;

namespace MassLab.Identity.Infrastructure;

internal sealed class CurrentTenantAccessor : ICurrentTenantAccessor
{
    private readonly ICurrentTenant _currentTenant;

    public CurrentTenantAccessor(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public Guid? Id => _currentTenant.Id;

    public string? Slug => _currentTenant.Slug;

    public MassLab.Identity.Web.Domain.TenantStatus? Status => _currentTenant.Status;

    public bool IsAvailable => _currentTenant.IsAvailable;
}
