using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetSystemTenantsQuery : IRequest<IReadOnlyCollection<SystemTenantDto>>;

public sealed class GetSystemTenantsQueryHandler : IRequestHandler<GetSystemTenantsQuery, IReadOnlyCollection<SystemTenantDto>>
{
    private readonly ISystemAdminQueries _queries;

    public GetSystemTenantsQueryHandler(ISystemAdminQueries queries)
    {
        _queries = queries;
    }

    public Task<IReadOnlyCollection<SystemTenantDto>> Handle(GetSystemTenantsQuery request, CancellationToken cancellationToken)
        => _queries.GetTenantsAsync(cancellationToken);
}
