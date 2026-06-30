using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record ToggleTenantCommand(Guid Id) : IRequest<CommandResult>;

public sealed class ToggleTenantCommandHandler : IRequestHandler<ToggleTenantCommand, CommandResult>
{
    private readonly ISystemAdminCommands _commands;

    public ToggleTenantCommandHandler(ISystemAdminCommands commands)
    {
        _commands = commands;
    }

    public Task<CommandResult> Handle(ToggleTenantCommand request, CancellationToken cancellationToken)
        => _commands.ToggleTenantAsync(request.Id, cancellationToken);
}
