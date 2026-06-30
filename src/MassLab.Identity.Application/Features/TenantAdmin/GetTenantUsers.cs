using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantUsersQuery(string? Query, string Sort, string Direction) : IRequest<TenantUsersDto>;

public sealed class GetTenantUsersQueryHandler : IRequestHandler<GetTenantUsersQuery, TenantUsersDto>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantUsersQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<TenantUsersDto> Handle(GetTenantUsersQuery request, CancellationToken cancellationToken)
        => _queries.GetUsersAsync(request.Query, request.Sort, request.Direction, cancellationToken);
}
