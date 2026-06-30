using System.Security.Claims;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Domain;

namespace MassLab.Identity.Application.Abstractions;

public interface ICurrentTenantAccessor
{
    Guid? Id { get; }
    string? Slug { get; }
    TenantStatus? Status { get; }
    bool IsAvailable { get; }
}

public sealed record MfaEnrollmentDto(string Secret, string AuthenticatorUri);

public interface IAccountQueries
{
    Task<MfaEnrollmentDto?> GetMfaEnrollmentAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
}

public interface IAccountCommands
{
    Task<LoginResult> LoginAsync(string email, string password, bool rememberMe, CancellationToken cancellationToken = default);
    Task LogoutAsync(CancellationToken cancellationToken = default);
    Task RequestPasswordResetAsync(string email, CancellationToken cancellationToken = default);
    Task<CommandResult> ResetPasswordAsync(string email, string token, string password, CancellationToken cancellationToken = default);
    Task<CommandResult> VerifyMfaChallengeAsync(ClaimsPrincipal principal, string code, CancellationToken cancellationToken = default);
    Task<VerifyEmailResult> VerifyEmailAsync(string email, string token, CancellationToken cancellationToken = default);
}

public sealed record AdminAuditLogDto(
    Guid Id,
    DateTimeOffset CreatedAt,
    string EventType,
    string Result,
    bool Succeeded,
    string ActorType,
    Guid? ActorUserId,
    string? TargetType,
    string? TargetId,
    string? IpAddress,
    string? TraceId);

public sealed record TenantUserDto(
    Guid Id,
    string? Email,
    string DisplayName,
    bool IsEnabled,
    bool IsSystemAdmin,
    bool IsTenantAdmin);

public sealed record TenantRoleDto(
    Guid Id,
    string Name,
    string Description);

public sealed record TenantPermissionDto(
    Guid Id,
    string Name,
    string Category,
    string? Description);

public sealed record ClientApplicationDto(
    Guid Id,
    string Name,
    string ClientId,
    string Type,
    bool Enabled,
    string AllowedFlows,
    string AllowedScopes,
    IReadOnlyCollection<string> RedirectUris);

public sealed record ExternalLoginProviderDto(
    Guid Id,
    string DisplayName,
    string Authority,
    string ClientId,
    string Scopes,
    bool Enabled,
    bool AutoProvisionUsers);

public sealed record UserSessionDto(
    Guid Id,
    Guid UserId,
    string? UserEmail,
    string SessionId,
    string? IpAddress,
    string? UserAgent,
    DateTimeOffset LastSeenAt,
    DateTimeOffset? RevokedAt,
    bool IsActive);

public sealed record SystemTenantDto(
    Guid Id,
    string Name,
    string Slug,
    string Status,
    bool IsActive,
    string? PrimaryHostName);

public sealed record TenantAdminDashboardDto(
    int Users,
    int Roles,
    int Permissions,
    int Clients,
    int Providers,
    int Sessions,
    IReadOnlyCollection<AdminAuditLogDto> RecentAuditLogs);

public sealed record TenantUsersDto(
    IReadOnlyCollection<TenantUserDto> Users,
    IReadOnlyCollection<TenantRoleDto> Roles,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedRoleIds);

public sealed record TenantRolesDto(
    IReadOnlyCollection<TenantRoleDto> Roles,
    IReadOnlyCollection<TenantPermissionDto> Permissions,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedPermissionIds);

public interface ITenantAdminQueries
{
    Task<TenantAdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default);
    Task<TenantUsersDto> GetUsersAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default);
    Task<TenantRolesDto> GetRolesAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<TenantPermissionDto>> GetPermissionsAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<ClientApplicationDto>> GetClientsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<ExternalLoginProviderDto>> GetProvidersAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<UserSessionDto>> GetSessionsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<AdminAuditLogDto>> GetAuditLogsAsync(CancellationToken cancellationToken = default);
}

public interface ITenantAdminCommands
{
    Task<CommandResult> CreateUserAsync(string email, string displayName, string password, bool isTenantAdmin, CancellationToken cancellationToken = default);
    Task<CommandResult> DisableUserAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CommandResult> EditUserAsync(Guid id, string email, string displayName, bool isEnabled, bool isTenantAdmin, CancellationToken cancellationToken = default);
    Task<CommandResult> DeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CommandResult> SetUserRolesAsync(Guid userId, IReadOnlyCollection<Guid> roleIds, CancellationToken cancellationToken = default);
    Task<CommandResult> CreateRoleAsync(string name, string description, CancellationToken cancellationToken = default);
    Task<CommandResult> EditRoleAsync(Guid id, string name, string description, CancellationToken cancellationToken = default);
    Task<CommandResult> DeleteRoleAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CommandResult> AssignRoleAsync(Guid userId, Guid roleId, CancellationToken cancellationToken = default);
    Task<CommandResult> CreatePermissionAsync(string name, string category, string? description, CancellationToken cancellationToken = default);
    Task<CommandResult> AssignPermissionAsync(Guid roleId, Guid permissionId, CancellationToken cancellationToken = default);
    Task<CommandResult> SetRolePermissionsAsync(Guid roleId, IReadOnlyCollection<Guid> permissionIds, CancellationToken cancellationToken = default);
    Task<CommandResult> EditPermissionAsync(Guid id, string name, string category, string? description, CancellationToken cancellationToken = default);
    Task<CommandResult> DeletePermissionAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CreateClientResult> CreateClientAsync(string name, string clientId, ClientType type, string redirectUri, string scopes, string flows, CancellationToken cancellationToken = default);
    Task<CommandResult> CreateProviderAsync(string displayName, string authority, string clientId, string clientSecret, string scopes, bool autoProvisionUsers, CancellationToken cancellationToken = default);
    Task<CommandResult> UpsertSmtpAsync(string host, int port, string? username, string? password, bool useTls, string fromEmail, string fromDisplayName, CancellationToken cancellationToken = default);
    Task<CommandResult> RevokeSessionAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record CreateClientResult(bool Succeeded, string? ClientId = null, string? ClientSecret = null, IReadOnlyCollection<string>? Errors = null)
{
    public static CreateClientResult Success(string clientId, string? clientSecret) => new(true, clientId, clientSecret);

    public static CreateClientResult Failure(params string[] errors) => new(false, Errors: errors);
}

public interface ISystemAdminQueries
{
    Task<IReadOnlyCollection<SystemTenantDto>> GetTenantsAsync(CancellationToken cancellationToken = default);
}

public interface ISystemAdminCommands
{
    Task CreateTenantAsync(string name, string slug, string hostName, CancellationToken cancellationToken = default);
    Task<CommandResult> ToggleTenantAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record OpenIdUserInfoDto(
    string? Subject,
    string? Name,
    string? Email,
    string? TenantId,
    bool IsSystemAdmin,
    bool IsTenantAdmin,
    IReadOnlyCollection<string> Permissions);

public interface IOpenIdQueries
{
    Task<IReadOnlyCollection<string>> GetEffectivePermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<OpenIdUserInfoDto> GetUserInfoAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
}
