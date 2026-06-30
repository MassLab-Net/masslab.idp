using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record AssignTenantRoleCommand(Guid UserId, Guid RoleId) : IRequest<CommandResult>;

public sealed class AssignTenantRoleCommandHandler : IRequestHandler<AssignTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public AssignTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(AssignTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.AssignRoleAsync(request.UserId, request.RoleId, cancellationToken);
}
