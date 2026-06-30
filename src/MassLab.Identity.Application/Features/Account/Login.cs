using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record LoginCommand(string Email, string Password, bool RememberMe) : IRequest<LoginResult>;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IAccountCommands _commands;

    public LoginCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
        => _commands.LoginAsync(request.Email, request.Password, request.RememberMe, cancellationToken);
}
