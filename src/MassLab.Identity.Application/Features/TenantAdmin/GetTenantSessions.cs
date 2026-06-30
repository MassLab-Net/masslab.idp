using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantSessionsQuery : IRequest<IReadOnlyCollection<UserSessionDto>>;

public sealed class GetTenantSessionsQueryHandler : IRequestHandler<GetTenantSessionsQuery, IReadOnlyCollection<UserSessionDto>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantSessionsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<UserSessionDto>> Handle(GetTenantSessionsQuery request, CancellationToken cancellationToken)
        => _queries.GetSessionsAsync(cancellationToken);
}
