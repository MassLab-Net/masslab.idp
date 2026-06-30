using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantRolesQuery(string? Query, string Sort, string Direction) : IRequest<TenantRolesDto>;

public sealed class GetTenantRolesQueryHandler : IRequestHandler<GetTenantRolesQuery, TenantRolesDto>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantRolesQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<TenantRolesDto> Handle(GetTenantRolesQuery request, CancellationToken cancellationToken)
        => _queries.GetRolesAsync(request.Query, request.Sort, request.Direction, cancellationToken);
}
