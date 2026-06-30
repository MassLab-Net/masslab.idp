using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantClientCommand(string Name, string ClientId, ClientType Type, string RedirectUri, string Scopes, string Flows) : IRequest<CreateClientResult>;
public sealed record CreateTenantProviderCommand(string DisplayName, string Authority, string ClientId, string ClientSecret, string Scopes, bool AutoProvisionUsers) : IRequest<CommandResult>;
public sealed record UpsertTenantSmtpCommand(string Host, int Port, string? Username, string? Password, bool UseTls, string FromEmail, string FromDisplayName) : IRequest<CommandResult>;
public sealed record RevokeTenantSessionCommand(Guid Id) : IRequest<CommandResult>;

public sealed class CreateTenantClientCommandHandler : IRequestHandler<CreateTenantClientCommand, CreateClientResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantClientCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CreateClientResult> Handle(CreateTenantClientCommand request, CancellationToken cancellationToken)
        => _commands.CreateClientAsync(request.Name, request.ClientId, request.Type, request.RedirectUri, request.Scopes, request.Flows, cancellationToken);
}

public sealed class CreateTenantProviderCommandHandler : IRequestHandler<CreateTenantProviderCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public CreateTenantProviderCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(CreateTenantProviderCommand request, CancellationToken cancellationToken)
        => _commands.CreateProviderAsync(request.DisplayName, request.Authority, request.ClientId, request.ClientSecret, request.Scopes, request.AutoProvisionUsers, cancellationToken);
}

public sealed class UpsertTenantSmtpCommandHandler : IRequestHandler<UpsertTenantSmtpCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public UpsertTenantSmtpCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(UpsertTenantSmtpCommand request, CancellationToken cancellationToken)
        => _commands.UpsertSmtpAsync(request.Host, request.Port, request.Username, request.Password, request.UseTls, request.FromEmail, request.FromDisplayName, cancellationToken);
}

public sealed class RevokeTenantSessionCommandHandler : IRequestHandler<RevokeTenantSessionCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public RevokeTenantSessionCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(RevokeTenantSessionCommand request, CancellationToken cancellationToken)
        => _commands.RevokeSessionAsync(request.Id, cancellationToken);
}
