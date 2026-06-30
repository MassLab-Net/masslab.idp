using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantClientsQuery : IRequest<IReadOnlyCollection<ClientApplication>>;

public sealed class GetTenantClientsQueryHandler : IRequestHandler<GetTenantClientsQuery, IReadOnlyCollection<ClientApplication>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantClientsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<ClientApplication>> Handle(GetTenantClientsQuery request, CancellationToken cancellationToken)
        => _queries.GetClientsAsync(cancellationToken);
}
