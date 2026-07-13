using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record DeleteTenantCommand(Guid Id) : IRequest<CommandResult>;

public sealed class DeleteTenantCommandHandler : IRequestHandler<DeleteTenantCommand, CommandResult>
{
    private readonly ISystemAdminCommands _commands;

    public DeleteTenantCommandHandler(ISystemAdminCommands commands)
    {
        _commands = commands;
    }

    public Task<CommandResult> Handle(DeleteTenantCommand request, CancellationToken cancellationToken)
        => _commands.DeleteTenantAsync(request.Id, cancellationToken);
}
