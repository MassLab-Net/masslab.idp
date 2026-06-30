using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;
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
    private readonly ILogger<EmailService> _logger;

    public EmailService(ApplicationDbContext db, ICurrentTenant tenant, ILogger<EmailService> logger)
    {
        _db = db;
        _tenant = tenant;
        _logger = logger;
    }

    public Task QueueVerificationEmailAsync(string email, string verificationUrl, CancellationToken cancellationToken = default)
        => LogEmailAsync("verification", email, verificationUrl, cancellationToken);

    public Task QueuePasswordResetEmailAsync(string email, string resetUrl, CancellationToken cancellationToken = default)
        => LogEmailAsync("password-reset", email, resetUrl, cancellationToken);

    private async Task LogEmailAsync(string kind, string email, string url, CancellationToken cancellationToken)
    {
        var smtp = await _db.TenantSmtpSettings.FirstOrDefaultAsync(x => x.TenantId == _tenant.Id, cancellationToken);
        _logger.LogInformation("Queued {Kind} email for {Email} using tenant SMTP {SmtpHost}. Url: {Url}", kind, email, smtp?.Host ?? "not-configured", url);
    }
}
