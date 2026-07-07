using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DeleteTenantClientCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DeleteTenantClientCommandHandler : IRequestHandler<DeleteTenantClientCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantClientCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantClientCommand request, CancellationToken cancellationToken)
        => _commands.DeleteClientAsync(request.Id, cancellationToken);
}
