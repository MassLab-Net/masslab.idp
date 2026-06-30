using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DisableTenantUserCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DisableTenantUserCommandHandler : IRequestHandler<DisableTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DisableTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DisableTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.DisableUserAsync(request.Id, cancellationToken);
}
