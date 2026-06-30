using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DeleteTenantPermissionCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DeleteTenantPermissionCommandHandler : IRequestHandler<DeleteTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.DeletePermissionAsync(request.Id, cancellationToken);
}
