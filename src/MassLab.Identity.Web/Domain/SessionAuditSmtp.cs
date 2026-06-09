namespace MassLab.Identity.Web.Domain;

public sealed class UserSession : TenantEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTimeOffset LastSeenAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? RevokedAt { get; set; }
    public bool IsActive => RevokedAt is null;
}

public sealed class AuditLog : TenantEntity
{
    public Guid? ActorUserId { get; set; }
    public ActorType ActorType { get; set; } = ActorType.User;
    public string EventType { get; set; } = string.Empty;
    public string? TargetType { get; set; }
    public string? TargetId { get; set; }
    public AuditResult Result { get; set; } = AuditResult.Success;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? TraceId { get; set; }
    public string? Details { get; set; }
}

public sealed class TenantSmtpSettings : TenantEntity
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string? Username { get; set; }
    public string? PasswordProtected { get; set; }
    public bool UseTls { get; set; } = true;
    public string FromEmail { get; set; } = string.Empty;
    public string FromDisplayName { get; set; } = string.Empty;
}

