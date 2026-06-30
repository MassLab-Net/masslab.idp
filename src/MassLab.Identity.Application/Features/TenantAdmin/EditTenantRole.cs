using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record EditTenantRoleCommand(Guid Id, string Name, string Description) : IRequest<CommandResult>;

public sealed class EditTenantRoleCommandHandler : IRequestHandler<EditTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.EditRoleAsync(request.Id, request.Name, request.Description, cancellationToken);
}
