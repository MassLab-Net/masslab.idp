using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Domain;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record UpsertTenantSmtpCommand(TenantEmailProvider Provider, string Host, int Port, string? Username, string? Password, bool UseTls, string FromEmail, string FromDisplayName, string? ResendApiKey, string? SesRegion, string? SesAccessKey, string? SesSecretKey, string? SesConfigurationSetName, string PasswordResetTemplate, string EmailVerificationTemplate) : IRequest<CommandResult>;

public sealed class UpsertTenantSmtpCommandHandler : IRequestHandler<UpsertTenantSmtpCommand, CommandResult>
{
    private readonly ITenantAdminCommands _commands;

    public UpsertTenantSmtpCommandHandler(ITenantAdminCommands commands) => _commands = commands;

    public Task<CommandResult> Handle(UpsertTenantSmtpCommand request, CancellationToken cancellationToken)
        => _commands.UpsertSmtpAsync(request.Provider, request.Host, request.Port, request.Username, request.Password, request.UseTls, request.FromEmail, request.FromDisplayName, request.ResendApiKey, request.SesRegion, request.SesAccessKey, request.SesSecretKey, request.SesConfigurationSetName, request.PasswordResetTemplate, request.EmailVerificationTemplate, cancellationToken);
}
