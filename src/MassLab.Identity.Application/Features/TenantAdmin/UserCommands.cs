using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantUserCommand(string Email, string DisplayName, string Password, bool IsTenantAdmin) : IRequest<CommandResult>;
public sealed record DisableTenantUserCommand(Guid Id) : IRequest<CommandResult>;
public sealed record EditTenantUserCommand(Guid Id, string Email, string DisplayName, bool IsEnabled, bool IsTenantAdmin) : IRequest<CommandResult>;
public sealed record DeleteTenantUserCommand(Guid Id) : IRequest<CommandResult>;
public sealed record SetTenantUserRolesCommand(Guid UserId, IReadOnlyCollection<Guid> RoleIds) : IRequest<CommandResult>;

public sealed class CreateTenantUserCommandHandler : IRequestHandler<CreateTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.CreateUserAsync(request.Email, request.DisplayName, request.Password, request.IsTenantAdmin, cancellationToken);
}

public sealed class DisableTenantUserCommandHandler : IRequestHandler<DisableTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DisableTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DisableTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.DisableUserAsync(request.Id, cancellationToken);
}

public sealed class EditTenantUserCommandHandler : IRequestHandler<EditTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.EditUserAsync(request.Id, request.Email, request.DisplayName, request.IsEnabled, request.IsTenantAdmin, cancellationToken);
}

public sealed class DeleteTenantUserCommandHandler : IRequestHandler<DeleteTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public DeleteTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(DeleteTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.DeleteUserAsync(request.Id, cancellationToken);
}

public sealed class SetTenantUserRolesCommandHandler : IRequestHandler<SetTenantUserRolesCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public SetTenantUserRolesCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(SetTenantUserRolesCommand request, CancellationToken cancellationToken)
        => _commands.SetUserRolesAsync(request.UserId, request.RoleIds, cancellationToken);
}
