using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantUserCommand(string Email, string DisplayName, string Password, bool IsTenantAdmin) : IRequest<CommandResult>;

public sealed class CreateTenantUserCommandHandler : IRequestHandler<CreateTenantUserCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantUserCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantUserCommand request, CancellationToken cancellationToken)
        => _commands.CreateUserAsync(request.Email, request.DisplayName, request.Password, request.IsTenantAdmin, cancellationToken);
}
