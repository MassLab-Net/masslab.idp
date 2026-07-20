using System.Net;
using System.Net.Mail;
using System.Text.Json;
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
                var smtp = await db.TenantSmtpSettings.IgnoreQueryFilters()
                    .FirstOrDefaultAsync(x => x.TenantId == message.TenantId, cancellationToken)
                    ?? throw new InvalidOperationException("Tenant SMTP settings are not configured.");

                using var client = new SmtpClient(smtp.Host, smtp.Port)
                {
                    EnableSsl = smtp.UseTls
                };
                if (!string.IsNullOrWhiteSpace(smtp.Username) && !string.IsNullOrWhiteSpace(smtp.PasswordProtected))
                {
                    client.Credentials = new NetworkCredential(smtp.Username, secrets.Unprotect(smtp.PasswordProtected));
                }

                using var email = new MailMessage(smtp.FromEmail, payload.To, payload.Subject, payload.Body);
                await client.SendMailAsync(email, cancellationToken);
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
}

public sealed record EmailOutboxPayload(string To, string Subject, string Body);
