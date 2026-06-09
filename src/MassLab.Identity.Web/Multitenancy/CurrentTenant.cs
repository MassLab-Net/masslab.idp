using MassLab.Identity.Web.Domain;

namespace MassLab.Identity.Web.Multitenancy;

public interface ICurrentTenant
{
    Guid? Id { get; }
    string? Slug { get; }
    TenantStatus? Status { get; }
    bool IsAvailable { get; }
    void Set(Guid? id, string? slug, TenantStatus? status);
}

public sealed class CurrentTenant : ICurrentTenant
{
    public Guid? Id { get; private set; }
    public string? Slug { get; private set; }
    public TenantStatus? Status { get; private set; }
    public bool IsAvailable => Id.HasValue;

    public void Set(Guid? id, string? slug, TenantStatus? status)
    {
        Id = id;
        Slug = slug;
        Status = status;
    }
}

