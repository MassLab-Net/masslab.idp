using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantSessionsQuery : IRequest<IReadOnlyCollection<UserSession>>;

public sealed class GetTenantSessionsQueryHandler : IRequestHandler<GetTenantSessionsQuery, IReadOnlyCollection<UserSession>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantSessionsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<UserSession>> Handle(GetTenantSessionsQuery request, CancellationToken cancellationToken)
        => _queries.GetSessionsAsync(cancellationToken);
}
