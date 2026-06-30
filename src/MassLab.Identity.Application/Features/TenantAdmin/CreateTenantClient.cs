using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantClientCommand(string Name, string ClientId, ClientType Type, string RedirectUri, string Scopes, string Flows) : IRequest<CreateClientResult>;

public sealed class CreateTenantClientCommandHandler : IRequestHandler<CreateTenantClientCommand, CreateClientResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantClientCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CreateClientResult> Handle(CreateTenantClientCommand request, CancellationToken cancellationToken)
        => _commands.CreateClientAsync(request.Name, request.ClientId, request.Type, request.RedirectUri, request.Scopes, request.Flows, cancellationToken);
}
