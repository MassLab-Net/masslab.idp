using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantClientsQuery : IRequest<IReadOnlyCollection<ClientApplicationDto>>;

public sealed class GetTenantClientsQueryHandler : IRequestHandler<GetTenantClientsQuery, IReadOnlyCollection<ClientApplicationDto>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantClientsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<ClientApplicationDto>> Handle(GetTenantClientsQuery request, CancellationToken cancellationToken)
        => _queries.GetClientsAsync(cancellationToken);
}
