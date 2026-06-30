using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetTenantProvidersQuery : IRequest<IReadOnlyCollection<ExternalLoginProviderDto>>;

public sealed class GetTenantProvidersQueryHandler : IRequestHandler<GetTenantProvidersQuery, IReadOnlyCollection<ExternalLoginProviderDto>>
{
    private readonly ITenantAdminQueries _queries;

    public GetTenantProvidersQueryHandler(ITenantAdminQueries queries) => _queries = queries;

    public Task<IReadOnlyCollection<ExternalLoginProviderDto>> Handle(GetTenantProvidersQuery request, CancellationToken cancellationToken)
        => _queries.GetProvidersAsync(cancellationToken);
}
