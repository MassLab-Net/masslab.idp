using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantPermissionCommand(string Name, string Category, string? Description) : IRequest<CommandResult>;

public sealed class CreateTenantPermissionCommandHandler : IRequestHandler<CreateTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.CreatePermissionAsync(request.Name, request.Category, request.Description, cancellationToken);
}
