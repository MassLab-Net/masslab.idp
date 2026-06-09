using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;

namespace MassLab.Identity.Web.Services;

public interface IAuditService
{
    Task WriteAsync(string eventType, AuditResult result, string? targetType = null, string? targetId = null, string? details = null, CancellationToken cancellationToken = default);
}

public sealed class AuditService : IAuditService
{
    private readonly ApplicationDbContext _db;
    private readonly ICurrentTenant _tenant;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(ApplicationDbContext db, ICurrentTenant tenant, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _tenant = tenant;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task WriteAsync(string eventType, AuditResult result, string? targetType = null, string? targetId = null, string? details = null, CancellationToken cancellationToken = default)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var userId = httpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        _db.AuditLogs.Add(new AuditLog
        {
            TenantId = _tenant.Id ?? Guid.Empty,
            ActorUserId = Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : null,
            ActorType = httpContext?.User.IsInRole("SystemAdmin") == true ? ActorType.SystemAdmin : ActorType.User,
            EventType = eventType,
            TargetType = targetType,
            TargetId = targetId,
            Result = result,
            IpAddress = httpContext?.Connection.RemoteIpAddress?.ToString(),
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString(),
            TraceId = httpContext?.TraceIdentifier,
            Details = details
        });

        await _db.SaveChangesAsync(cancellationToken);
    }
}

