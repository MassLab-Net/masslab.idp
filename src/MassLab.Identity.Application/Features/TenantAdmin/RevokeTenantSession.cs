using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record RevokeTenantSessionCommand(Guid Id) : IRequest<CommandResult>;

public sealed class RevokeTenantSessionCommandHandler : IRequestHandler<RevokeTenantSessionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public RevokeTenantSessionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(RevokeTenantSessionCommand request, CancellationToken cancellationToken)
        => _commands.RevokeSessionAsync(request.Id, cancellationToken);
}
