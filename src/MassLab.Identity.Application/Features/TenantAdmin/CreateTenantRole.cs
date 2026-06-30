using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantRoleCommand(string Name, string Description) : IRequest<CommandResult>;

public sealed class CreateTenantRoleCommandHandler : IRequestHandler<CreateTenantRoleCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantRoleCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantRoleCommand request, CancellationToken cancellationToken)
        => _commands.CreateRoleAsync(request.Name, request.Description, cancellationToken);
}
