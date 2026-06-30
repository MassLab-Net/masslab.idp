using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record EditTenantUserCommand(Guid Id, string Email, string DisplayName, bool IsEnabled, bool IsTenantAdmin) : IRequest<CommandResult>;

public sealed class EditTenantUserCommandHandler : IRequestHandler<EditTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.EditUserAsync(request.Id, request.Email, request.DisplayName, request.IsEnabled, request.IsTenantAdmin, cancellationToken);
}
