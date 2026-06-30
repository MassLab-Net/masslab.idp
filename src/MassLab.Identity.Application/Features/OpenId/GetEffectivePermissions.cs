using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetEffectivePermissionsQuery(Guid UserId) : IRequest<IReadOnlyCollection<string>>;

public sealed class GetEffectivePermissionsQueryHandler : IRequestHandler<GetEffectivePermissionsQuery, IReadOnlyCollection<string>>
{
    private readonly IOpenIdQueries _queries;

    public GetEffectivePermissionsQueryHandler(IOpenIdQueries queries)
    {
        _queries = queries;
    }

    public Task<IReadOnlyCollection<string>> Handle(GetEffectivePermissionsQuery request, CancellationToken cancellationToken)
        => _queries.GetEffectivePermissionsAsync(request.UserId, cancellationToken);
}
