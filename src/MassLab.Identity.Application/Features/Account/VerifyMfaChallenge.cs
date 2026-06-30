using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record VerifyMfaChallengeCommand(ClaimsPrincipal Principal, string Code) : IRequest<CommandResult>;

public sealed class VerifyMfaChallengeCommandHandler : IRequestHandler<VerifyMfaChallengeCommand, CommandResult>
{
    private readonly IAccountCommands _commands;

    public VerifyMfaChallengeCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public Task<CommandResult> Handle(VerifyMfaChallengeCommand request, CancellationToken cancellationToken)
        => _commands.VerifyMfaChallengeAsync(request.Principal, request.Code, cancellationToken);
}
