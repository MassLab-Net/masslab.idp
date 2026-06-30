using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantAuditLogsQuery : IRequest<IReadOnlyCollection<AuditLog>>;

public sealed class GetTenantAuditLogsQueryHandler : IRequestHandler<GetTenantAuditLogsQuery, IReadOnlyCollection<AuditLog>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantAuditLogsQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<AuditLog>> Handle(GetTenantAuditLogsQuery request, CancellationToken cancellationToken)
        => _queries.GetAuditLogsAsync(cancellationToken);
}
