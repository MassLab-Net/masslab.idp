using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantPermissionsQuery(string? Query, string Sort, string Direction) : IRequest<IReadOnlyCollection<TenantPermission>>;

public sealed class GetTenantPermissionsQueryHandler : IRequestHandler<GetTenantPermissionsQuery, IReadOnlyCollection<TenantPermission>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantPermissionsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<TenantPermission>> Handle(GetTenantPermissionsQuery request, CancellationToken cancellationToken)
        => _queries.GetPermissionsAsync(request.Query, request.Sort, request.Direction, cancellationToken);
}
