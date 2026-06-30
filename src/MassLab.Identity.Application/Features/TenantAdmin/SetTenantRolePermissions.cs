using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record SetTenantRolePermissionsCommand(Guid RoleId, IReadOnlyCollection<Guid> PermissionIds) : IRequest<CommandResult>;

public sealed class SetTenantRolePermissionsCommandHandler : IRequestHandler<SetTenantRolePermissionsCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public SetTenantRolePermissionsCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(SetTenantRolePermissionsCommand request, CancellationToken cancellationToken)
        => _commands.SetRolePermissionsAsync(request.RoleId, request.PermissionIds, cancellationToken);
}
