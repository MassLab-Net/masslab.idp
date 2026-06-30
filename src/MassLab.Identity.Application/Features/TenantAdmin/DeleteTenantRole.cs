using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DeleteTenantRoleCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DeleteTenantRoleCommandHandler : IRequestHandler<DeleteTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.DeleteRoleAsync(request.Id, cancellationToken);
}
