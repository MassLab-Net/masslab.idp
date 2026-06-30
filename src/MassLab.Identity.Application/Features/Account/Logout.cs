using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record LogoutCommand : IRequest;

public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand>
{
    private readonly IAccountCommands _commands;

    public LogoutCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _commands.LogoutAsync(cancellationToken);
    }
}
