using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantDashboardQuery : IRequest<TenantAdminDashboardDto>;

public sealed class GetTenantDashboardQueryHandler : IRequestHandler<GetTenantDashboardQuery, TenantAdminDashboardDto>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantDashboardQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<TenantAdminDashboardDto> Handle(GetTenantDashboardQuery request, CancellationToken cancellationToken)
        => _queries.GetDashboardAsync(cancellationToken);
}
