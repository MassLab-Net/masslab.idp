using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantPermissionsQuery(string? Query, string Sort, string Direction) : IRequest<IReadOnlyCollection<TenantPermissionDto>>;

public sealed class GetTenantPermissionsQueryHandler : IRequestHandler<GetTenantPermissionsQuery, IReadOnlyCollection<TenantPermissionDto>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantPermissionsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<TenantPermissionDto>> Handle(GetTenantPermissionsQuery request, CancellationToken cancellationToken)
        => _queries.GetPermissionsAsync(request.Query, request.Sort, request.Direction, cancellationToken);
}
