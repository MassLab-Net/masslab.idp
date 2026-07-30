using System.Text.Json;
using MassLab.Common.Email.Abstractions;
using MassLab.Common.Email.Models;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MassLab.Identity.Infrastructure.Services;

public interface IEmailService
{
    Task QueueVerificationEmailAsync(string email, string verificationUrl, CancellationToken cancellationToken = default);
    Task QueuePasswordResetEmailAsync(string email, string resetUrl, CancellationToken cancellationToken = default);
}

public sealed class EmailService : IEmailService
{
    private readonly ApplicationDbContext _db;
    private readonly ICurrentTenant _tenant;

    public EmailService(ApplicationDbContext db, ICurrentTenant tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    public Task QueueVerificationEmailAsync(string email, string verificationUrl, CancellationToken cancellationToken = default)
        => QueueAsync("email.verification", email, "Verify your MassLab Identity email", $"Verify your email: {verificationUrl}", cancellationToken);

    public Task QueuePasswordResetEmailAsync(string email, string resetUrl, CancellationToken cancellationToken = default)
        => QueueAsync("email.password-reset", email, "Reset your MassLab Identity password", $"Reset your password: {resetUrl}", cancellationToken);

    private async Task QueueAsync(string type, string email, string subject, string body, CancellationToken cancellationToken)
    {
        if (!_tenant.Id.HasValue)
        {
            return;
        }

        _db.OutboxMessages.Add(new OutboxMessage
        {
            TenantId = _tenant.Id.Value,
            Type = type,
            Payload = JsonSerializer.Serialize(new EmailOutboxPayload(email, subject, body))
        });
        await _db.SaveChangesAsync(cancellationToken);
    }
}

public sealed class OutboxEmailWorker : BackgroundService
{
    private const int MaxAttempts = 8;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OutboxEmailWorker> _logger;

    public OutboxEmailWorker(IServiceScopeFactory scopeFactory, ILogger<OutboxEmailWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessBatchAsync(stoppingToken);
            }
            catch (Exception exception) when (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogError(exception, "Outbox email worker failed while processing a batch.");
            }

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }

    private async Task ProcessBatchAsync(CancellationToken cancellationToken)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var secrets = scope.ServiceProvider.GetRequiredService<ISecretService>();
        var senderFactory = scope.ServiceProvider.GetRequiredService<IEmailSenderFactory>();
        var now = DateTimeOffset.UtcNow;
        var messages = await db.OutboxMessages.IgnoreQueryFilters()
            .Where(x => x.ProcessedAt == null && x.AttemptCount < MaxAttempts && (x.NextAttemptAt == null || x.NextAttemptAt <= now))
            .OrderBy(x => x.CreatedAt)
            .Take(20)
            .ToListAsync(cancellationToken);

        foreach (var message in messages)
        {
            try
            {
                var payload = JsonSerializer.Deserialize<EmailOutboxPayload>(message.Payload)
                    ?? throw new InvalidOperationException("Outbox payload is invalid.");
                var settings = await db.TenantSmtpSettings.IgnoreQueryFilters()
                    .FirstOrDefaultAsync(x => x.TenantId == message.TenantId, cancellationToken)
                    ?? throw new InvalidOperationException("Tenant email settings are not configured.");
                var tenantName = await db.Tenants.IgnoreQueryFilters().Where(x => x.Id == message.TenantId).Select(x => x.Name).SingleOrDefaultAsync(cancellationToken) ?? "MassLab";
                var configuration = ToProviderConfiguration(settings, secrets);
                EmailContent content = settings.Provider == TenantEmailProvider.Smtp
                    ? new LocalTemplateEmailContent(message.Type == "email.password-reset" ? settings.PasswordResetTemplate : settings.EmailVerificationTemplate, new { RESET_URL = payload.Body, VERIFICATION_URL = payload.Body, TENANT_NAME = tenantName })
                    : new ProviderTemplateEmailContent(message.Type == "email.password-reset" ? settings.PasswordResetTemplate : settings.EmailVerificationTemplate, new Dictionary<string, object?> { [message.Type == "email.password-reset" ? "RESET_URL" : "VERIFICATION_URL"] = payload.Body, ["TENANT_NAME"] = tenantName });
                await using var sender = senderFactory.Create(configuration);
                var result = await sender.SendAsync(new EmailSendRequest
                {
                    To = [new EmailAddress(payload.To)], Content = content,
                    From = new EmailAddress(settings.FromEmail, settings.FromDisplayName),
                    CorrelationId = message.Id.ToString(), IdempotencyKey = $"identity-email/{message.Id}"
                }, cancellationToken);
                if (result.Status != EmailSubmissionStatus.Accepted) throw new InvalidOperationException(result.ErrorMessage ?? result.ErrorCode ?? "Email provider rejected the message.");
                message.ProcessedAt = DateTimeOffset.UtcNow;
                message.LastError = null;
            }
            catch (Exception exception)
            {
                message.AttemptCount++;
                message.LastError = exception.Message[..Math.Min(exception.Message.Length, 1000)];
                message.NextAttemptAt = DateTimeOffset.UtcNow.AddMinutes(Math.Min(60, Math.Pow(2, message.AttemptCount)));
                _logger.LogWarning(exception, "Email outbox message {MessageId} failed on attempt {AttemptCount}.", message.Id, message.AttemptCount);
            }
        }

        if (messages.Count > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    private static EmailProviderConfiguration ToProviderConfiguration(TenantSmtpSettings settings, ISecretService secrets) => settings.Provider switch
    {
        TenantEmailProvider.Smtp => new SmtpEmailProviderConfiguration($"{settings.FromDisplayName} <{settings.FromEmail}>", settings.Host, settings.Port, settings.UseTls, settings.Username, string.IsNullOrWhiteSpace(settings.PasswordProtected) ? null : secrets.Unprotect(settings.PasswordProtected)),
        TenantEmailProvider.Resend => new ResendEmailProviderConfiguration($"{settings.FromDisplayName} <{settings.FromEmail}>", string.IsNullOrWhiteSpace(settings.ResendApiKeyProtected) ? throw new InvalidOperationException("Resend API key is not configured.") : secrets.Unprotect(settings.ResendApiKeyProtected)),
        TenantEmailProvider.Ses => new SesEmailProviderConfiguration($"{settings.FromDisplayName} <{settings.FromEmail}>", settings.SesRegion ?? throw new InvalidOperationException("SES region is not configured."), string.IsNullOrWhiteSpace(settings.SesAccessKeyProtected) ? null : secrets.Unprotect(settings.SesAccessKeyProtected), string.IsNullOrWhiteSpace(settings.SesSecretKeyProtected) ? null : secrets.Unprotect(settings.SesSecretKeyProtected), settings.SesConfigurationSetName),
        _ => throw new InvalidOperationException("Unsupported email provider.")
    };
}

public sealed record EmailOutboxPayload(string To, string Subject, string Body);
