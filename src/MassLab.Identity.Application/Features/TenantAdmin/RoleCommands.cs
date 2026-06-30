using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantRoleCommand(string Name, string Description) : IRequest<CommandResult>;
public sealed record EditTenantRoleCommand(Guid Id, string Name, string Description) : IRequest<CommandResult>;
public sealed record DeleteTenantRoleCommand(Guid Id) : IRequest<CommandResult>;
public sealed record AssignTenantRoleCommand(Guid UserId, Guid RoleId) : IRequest<CommandResult>;

public sealed class CreateTenantRoleCommandHandler : IRequestHandler<CreateTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.CreateRoleAsync(request.Name, request.Description, cancellationToken);
}

public sealed class EditTenantRoleCommandHandler : IRequestHandler<EditTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.EditRoleAsync(request.Id, request.Name, request.Description, cancellationToken);
}

public sealed class DeleteTenantRoleCommandHandler : IRequestHandler<DeleteTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.DeleteRoleAsync(request.Id, cancellationToken);
}

public sealed class AssignTenantRoleCommandHandler : IRequestHandler<AssignTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public AssignTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(AssignTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.AssignRoleAsync(request.UserId, request.RoleId, cancellationToken);
}
