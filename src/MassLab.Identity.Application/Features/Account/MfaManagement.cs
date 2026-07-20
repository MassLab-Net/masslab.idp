using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record GetMfaStatusQuery(ClaimsPrincipal Principal) : IRequest<MfaStatusDto?>;
public sealed record DisableMfaCommand(ClaimsPrincipal Principal, string Code) : IRequest<CommandResult>;
public sealed record RegenerateMfaRecoveryCodesCommand(ClaimsPrincipal Principal) : IRequest<MfaRecoveryCodesDto?>;

public sealed class GetMfaStatusQueryHandler : IRequestHandler<GetMfaStatusQuery, MfaStatusDto?>
{
    private readonly IAccountQueries _queries;
    public GetMfaStatusQueryHandler(IAccountQueries queries) => _queries = queries;
    public Task<MfaStatusDto?> Handle(GetMfaStatusQuery request, CancellationToken cancellationToken)
        => _queries.GetMfaStatusAsync(request.Principal, cancellationToken);
}

public sealed class DisableMfaCommandHandler : IRequestHandler<DisableMfaCommand, CommandResult>
{
    private readonly IAccountCommands _commands;
    public DisableMfaCommandHandler(IAccountCommands commands) => _commands = commands;
    public Task<CommandResult> Handle(DisableMfaCommand request, CancellationToken cancellationToken)
        => _commands.DisableMfaAsync(request.Principal, request.Code, cancellationToken);
}

public sealed class RegenerateMfaRecoveryCodesCommandHandler : IRequestHandler<RegenerateMfaRecoveryCodesCommand, MfaRecoveryCodesDto?>
{
    private readonly IAccountCommands _commands;
    public RegenerateMfaRecoveryCodesCommandHandler(IAccountCommands commands) => _commands = commands;
    public Task<MfaRecoveryCodesDto?> Handle(RegenerateMfaRecoveryCodesCommand request, CancellationToken cancellationToken)
        => _commands.RegenerateMfaRecoveryCodesAsync(request.Principal, cancellationToken);
}
