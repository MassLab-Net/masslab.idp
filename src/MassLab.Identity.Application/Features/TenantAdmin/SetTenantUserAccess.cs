using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record SetTenantUserAccessCommand(
    Guid UserId,
    IReadOnlyCollection<Guid> RoleIds,
    IReadOnlyCollection<Guid> GrantedPermissionIds,
    IReadOnlyCollection<Guid> DeniedPermissionIds) : IRequest<CommandResult>;

public sealed class SetTenantUserAccessCommandHandler : IRequestHandler<SetTenantUserAccessCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public SetTenantUserAccessCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(SetTenantUserAccessCommand request, CancellationToken cancellationToken)
        => _commands.SetUserAccessAsync(
            request.UserId,
            request.RoleIds,
            request.GrantedPermissionIds,
            request.DeniedPermissionIds,
            cancellationToken);
}
