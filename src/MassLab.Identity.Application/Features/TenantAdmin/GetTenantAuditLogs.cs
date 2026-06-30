using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantAuditLogsQuery : IRequest<IReadOnlyCollection<AdminAuditLogDto>>;

public sealed class GetTenantAuditLogsQueryHandler : IRequestHandler<GetTenantAuditLogsQuery, IReadOnlyCollection<AdminAuditLogDto>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantAuditLogsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<AdminAuditLogDto>> Handle(GetTenantAuditLogsQuery request, CancellationToken cancellationToken)
        => _queries.GetAuditLogsAsync(cancellationToken);
}
