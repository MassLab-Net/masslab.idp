using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record ResetPasswordCommand(string Email, string Token, string Password) : IRequest<CommandResult>;

public sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, CommandResult>
{
    private readonly IAccountCommands _commands;

    public ResetPasswordCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public Task<CommandResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        => _commands.ResetPasswordAsync(request.Email, request.Token, request.Password, cancellationToken);
}
