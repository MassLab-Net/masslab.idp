using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record EditTenantPermissionCommand(Guid Id, string Name, string Category, string? Description) : IRequest<CommandResult>;

public sealed class EditTenantPermissionCommandHandler : IRequestHandler<EditTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.EditPermissionAsync(request.Id, request.Name, request.Category, request.Description, cancellationToken);
}
