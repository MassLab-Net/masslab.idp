using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DeleteTenantUserCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DeleteTenantUserCommandHandler : IRequestHandler<DeleteTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.DeleteUserAsync(request.Id, cancellationToken);
}
