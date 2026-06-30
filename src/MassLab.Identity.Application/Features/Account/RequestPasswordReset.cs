using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record RequestPasswordResetCommand(string Email) : IRequest;

public sealed class RequestPasswordResetCommandHandler : IRequestHandler<RequestPasswordResetCommand>
{
    private readonly IAccountCommands _commands;

    public RequestPasswordResetCommandHandler(IAccountCommands commands)
    {
        _commands = commands;
    }

    public async Task Handle(RequestPasswordResetCommand request, CancellationToken cancellationToken)
    {
        await _commands.RequestPasswordResetAsync(request.Email, cancellationToken);
    }
}
