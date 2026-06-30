using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record SetTenantUserRolesCommand(Guid UserId, IReadOnlyCollection<Guid> RoleIds) : IRequest<CommandResult>;

public sealed class SetTenantUserRolesCommandHandler : IRequestHandler<SetTenantUserRolesCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public SetTenantUserRolesCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(SetTenantUserRolesCommand request, CancellationToken cancellationToken)
        => _commands.SetUserRolesAsync(request.UserId, request.RoleIds, cancellationToken);
}
