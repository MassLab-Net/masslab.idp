using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetSystemTenantsQuery : IRequest<IReadOnlyCollection<Tenant>>;

public sealed class GetSystemTenantsQueryHandler : IRequestHandler<GetSystemTenantsQuery, IReadOnlyCollection<Tenant>>
{
    private readonly ISystemAdminQueries _queries;

    public GetSystemTenantsQueryHandler(ISystemAdminQueries queries)
    {
        _queries = queries;
    }

    public Task<IReadOnlyCollection<Tenant>> Handle(GetSystemTenantsQuery request, CancellationToken cancellationToken)
        => _queries.GetTenantsAsync(cancellationToken);
}
