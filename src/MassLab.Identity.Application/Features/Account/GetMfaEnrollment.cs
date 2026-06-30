using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetMfaEnrollmentQuery(ClaimsPrincipal Principal) : IRequest<MfaEnrollmentDto?>;

public sealed class GetMfaEnrollmentQueryHandler : IRequestHandler<GetMfaEnrollmentQuery, MfaEnrollmentDto?>
{
    private readonly IAccountQueries _queries;

    public GetMfaEnrollmentQueryHandler(IAccountQueries queries)
    {
        _queries = queries;
    }

    public Task<MfaEnrollmentDto?> Handle(GetMfaEnrollmentQuery request, CancellationToken cancellationToken)
        => _queries.GetMfaEnrollmentAsync(request.Principal, cancellationToken);
}
