using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetUserInfoQuery(ClaimsPrincipal Principal) : IRequest<OpenIdUserInfoDto>;

public sealed class GetUserInfoQueryHandler : IRequestHandler<GetUserInfoQuery, OpenIdUserInfoDto>
{
    private readonly IOpenIdQueries _queries;

    public GetUserInfoQueryHandler(IOpenIdQueries queries)
    {
        _queries = queries;
    }

    public Task<OpenIdUserInfoDto> Handle(GetUserInfoQuery request, CancellationToken cancellationToken)
        => _queries.GetUserInfoAsync(request.Principal, cancellationToken);
}
