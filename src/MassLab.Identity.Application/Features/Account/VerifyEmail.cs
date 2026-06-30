using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record VerifyEmailCommand(string Email, string Token) : IRequest<VerifyEmailResult>;

public sealed class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, VerifyEmailResult>
{
    private readonly IAccountCommands _commands;

    public VerifyEmailCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public Task<VerifyEmailResult> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
        => _commands.VerifyEmailAsync(request.Email, request.Token, cancellationToken);
}
