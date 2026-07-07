using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record EditTenantClientCommand(Guid Id, string Name, ClientType Type, string[] RedirectUris, string[] PostLogoutRedirectUris, string Scopes, string Flows, bool Enabled) : IRequest<CommandResult>;

public sealed class EditTenantClientCommandHandler : IRequestHandler<EditTenantClientCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public EditTenantClientCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(EditTenantClientCommand request, CancellationToken cancellationToken)
        => _commands.EditClientAsync(request.Id, request.Name, request.Type, request.RedirectUris, request.PostLogoutRedirectUris, request.Scopes, request.Flows, request.Enabled, cancellationToken);
}
