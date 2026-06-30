using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantPermissionCommand(string Name, string Category, string? Description) : IRequest<CommandResult>;
public sealed record AssignTenantPermissionCommand(Guid RoleId, Guid PermissionId) : IRequest<CommandResult>;
public sealed record SetTenantRolePermissionsCommand(Guid RoleId, IReadOnlyCollection<Guid> PermissionIds) : IRequest<CommandResult>;
public sealed record EditTenantPermissionCommand(Guid Id, string Name, string Category, string? Description) : IRequest<CommandResult>;
public sealed record DeleteTenantPermissionCommand(Guid Id) : IRequest<CommandResult>;

public sealed class CreateTenantPermissionCommandHandler : IRequestHandler<CreateTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.CreatePermissionAsync(request.Name, request.Category, request.Description, cancellationToken);
}

public sealed class AssignTenantPermissionCommandHandler : IRequestHandler<AssignTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public AssignTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(AssignTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.AssignPermissionAsync(request.RoleId, request.PermissionId, cancellationToken);
}

public sealed class SetTenantRolePermissionsCommandHandler : IRequestHandler<SetTenantRolePermissionsCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public SetTenantRolePermissionsCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(SetTenantRolePermissionsCommand request, CancellationToken cancellationToken)
        => _commands.SetRolePermissionsAsync(request.RoleId, request.PermissionIds, cancellationToken);
}

public sealed class EditTenantPermissionCommandHandler : IRequestHandler<EditTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.EditPermissionAsync(request.Id, request.Name, request.Category, request.Description, cancellationToken);
}

public sealed class DeleteTenantPermissionCommandHandler : IRequestHandler<DeleteTenantPermissionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantPermissionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantPermissionCommand request, CancellationToken cancellationToken)
        => _commands.DeletePermissionAsync(request.Id, cancellationToken);
}
