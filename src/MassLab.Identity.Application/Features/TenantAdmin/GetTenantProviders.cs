using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantProvidersQuery : IRequest<IReadOnlyCollection<ExternalLoginProvider>>;

public sealed class GetTenantProvidersQueryHandler : IRequestHandler<GetTenantProvidersQuery, IReadOnlyCollection<ExternalLoginProvider>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantProvidersQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<ExternalLoginProvider>> Handle(GetTenantProvidersQuery request, CancellationToken cancellationToken)
        => _queries.GetProvidersAsync(cancellationToken);
}
