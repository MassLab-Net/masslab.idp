using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record AssignTenantPermissionCommand(Guid RoleId, Guid PermissionId) : IRequest<CommandResult>;

public sealed class AssignTenantPermissionCommandHandler : IRequestHandler<AssignTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public AssignTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(AssignTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.AssignPermissionAsync(request.RoleId, request.PermissionId, cancellationToken);
}
