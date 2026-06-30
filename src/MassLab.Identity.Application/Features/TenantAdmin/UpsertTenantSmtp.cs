using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record UpsertTenantSmtpCommand(string Host, int Port, string? Username, string? Password, bool UseTls, string FromEmail, string FromDisplayName) : IRequest<CommandResult>;

public sealed class UpsertTenantSmtpCommandHandler : IRequestHandler<UpsertTenantSmtpCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public UpsertTenantSmtpCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(UpsertTenantSmtpCommand request, CancellationToken cancellationToken)
        => _commands.UpsertSmtpAsync(request.Host, request.Port, request.Username, request.Password, request.UseTls, request.FromEmail, request.FromDisplayName, cancellationToken);
}
