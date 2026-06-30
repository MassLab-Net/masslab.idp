using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantProviderCommand(string DisplayName, string Authority, string ClientId, string ClientSecret, string Scopes, bool AutoProvisionUsers) : IRequest<CommandResult>;

public sealed class CreateTenantProviderCommandHandler : IRequestHandler<CreateTenantProviderCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantProviderCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantProviderCommand request, CancellationToken cancellationToken)
        => _commands.CreateProviderAsync(request.DisplayName, request.Authority, request.ClientId, request.ClientSecret, request.Scopes, request.AutoProvisionUsers, cancellationToken);
}
