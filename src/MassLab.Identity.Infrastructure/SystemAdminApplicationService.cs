using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure;

internal sealed class SystemAdminApplicationService : ISystemAdminQueries, ISystemAdminCommands
{
    private readonly ApplicationDbContext _db;

    public SystemAdminApplicationService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyCollection<Tenant>> GetTenantsAsync(CancellationToken cancellationToken = default)
        => await _db.Tenants.IgnoreQueryFilters().OrderBy(x => x.Name).ToListAsync(cancellationToken);

    public async Task CreateTenantAsync(string name, string slug, string hostName, CancellationToken cancellationToken = default)
    {
        var tenant = new Tenant { Name = name, Slug = slug, Status = TenantStatus.Active };
        _db.Tenants.Add(tenant);
        _db.TenantDomains.Add(new TenantDomain { TenantId = tenant.Id, HostName = hostName, IsPrimary = true });
        _db.TenantDefaultPolicies.Add(new TenantDefaultPolicy { TenantId = tenant.Id });
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<CommandResult> ToggleTenantAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var tenant = await _db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (tenant is null)
        {
            return CommandResult.Missing();
        }

        tenant.Status = tenant.Status == TenantStatus.Active ? TenantStatus.Disabled : TenantStatus.Active;
        tenant.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        return CommandResult.Success();
    }
}
