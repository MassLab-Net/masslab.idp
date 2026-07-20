using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure;

internal sealed class TenantAdminApplicationService : ITenantAdminQueries, ITenantAdminCommands
{
    private const string TenantAdminRoleName = "TenantAdmin";
    private static readonly HashSet<string> BootstrapPermissionNames =
    [
        "tenants.manage",
        "users.manage",
        "roles.manage",
        "permissions.manage",
        "clients.manage",
        "providers.manage",
        "smtp.manage",
        "sessions.manage",
        "audit.read"
    ];

    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICurrentTenant _tenant;
    private readonly ISecretService _secrets;
    private readonly IAuditService _audit;
    private readonly OpenIddictClientService _clientService;

    public TenantAdminApplicationService(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager,
        ICurrentTenant tenant,
        ISecretService secrets,
        IAuditService audit,
        OpenIddictClientService clientService)
    {
        _db = db;
        _userManager = userManager;
        _tenant = tenant;
        _secrets = secrets;
        _audit = audit;
        _clientService = clientService;
    }

    public async Task<TenantAdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var clients = await _clientService.GetAllAsync(cancellationToken);
        
        return new TenantAdminDashboardDto(
            await _db.Users.CountAsync(cancellationToken),
            await _db.TenantRoles.CountAsync(cancellationToken),
            await _db.TenantPermissions.CountAsync(cancellationToken),
            clients.Count,
            await _db.ExternalLoginProviders.CountAsync(cancellationToken),
            await _db.UserSessions.CountAsync(cancellationToken),
            await _db.AuditLogs
                .OrderByDescending(x => x.CreatedAt)
                .Take(25)
                .Select(x => new AdminAuditLogDto(
                    x.Id,
                    x.CreatedAt,
                    x.EventType,
                    x.Result.ToString(),
                    x.Result == AuditResult.Success,
                    x.ActorType.ToString(),
                    x.ActorUserId,
                    x.TargetType,
                    x.TargetId,
                    x.IpAddress,
                    x.TraceId))
                .ToListAsync(cancellationToken));
    }

    public async Task<TenantUsersDto> GetUsersAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
    {
        var usersQuery = _db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(query))
        {
            usersQuery = usersQuery.Where(x =>
                (x.Email != null && x.Email.Contains(query)) ||
                x.DisplayName.Contains(query));
        }

        usersQuery = (sort, direction) switch
        {
            ("name", "desc") => usersQuery.OrderByDescending(x => x.DisplayName),
            ("name", _) => usersQuery.OrderBy(x => x.DisplayName),
            ("status", "desc") => usersQuery.OrderByDescending(x => x.IsEnabled),
            ("status", _) => usersQuery.OrderBy(x => x.IsEnabled),
            ("email", "desc") => usersQuery.OrderByDescending(x => x.Email),
            _ => usersQuery.OrderBy(x => x.Email)
        };

        var assignments = await _db.UserRoleAssignments
            .GroupBy(x => x.UserId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.RoleId).ToHashSet(), cancellationToken);

        var rolePermissionIds = await _db.RolePermissionAssignments
            .GroupBy(x => x.RoleId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.PermissionId).ToHashSet(), cancellationToken);

        var grantedPermissionIds = await _db.UserPermissionAssignments
            .Where(x => x.IsGranted)
            .GroupBy(x => x.UserId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.PermissionId).ToHashSet(), cancellationToken);

        var deniedPermissionIds = await _db.UserPermissionAssignments
            .Where(x => !x.IsGranted)
            .GroupBy(x => x.UserId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.PermissionId).ToHashSet(), cancellationToken);

        var normalizedGrantedPermissionIds = new Dictionary<Guid, HashSet<Guid>>();
        var normalizedDeniedPermissionIds = new Dictionary<Guid, HashSet<Guid>>();

        foreach (var userId in assignments.Keys
            .Concat(grantedPermissionIds.Keys)
            .Concat(deniedPermissionIds.Keys)
            .Distinct())
        {
            var inheritedPermissionIds = new HashSet<Guid>();
            foreach (var roleId in assignments.GetValueOrDefault(userId) ?? [])
            {
                foreach (var permissionId in rolePermissionIds.GetValueOrDefault(roleId) ?? [])
                {
                    inheritedPermissionIds.Add(permissionId);
                }
            }

            var normalizedGranted = grantedPermissionIds
                .GetValueOrDefault(userId)?
                .Where(permissionId => !inheritedPermissionIds.Contains(permissionId))
                .ToHashSet() ?? [];

            var normalizedDenied = deniedPermissionIds
                .GetValueOrDefault(userId)?
                .Where(permissionId => inheritedPermissionIds.Contains(permissionId))
                .ToHashSet() ?? [];

            if (normalizedGranted.Count > 0)
            {
                normalizedGrantedPermissionIds[userId] = normalizedGranted;
            }

            if (normalizedDenied.Count > 0)
            {
                normalizedDeniedPermissionIds[userId] = normalizedDenied;
            }
        }

        return new TenantUsersDto(
            await usersQuery
                .Select(x => new TenantUserDto(
                    x.Id,
                    x.Email,
                    x.DisplayName,
                    x.IsEnabled,
                    x.IsSystemAdmin,
                    x.IsTenantAdmin,
                    x.IsBootstrapUser))
                .ToListAsync(cancellationToken),
            await _db.TenantRoles
                .OrderBy(x => x.Name)
                .Select(x => new TenantRoleDto(x.Id, x.Name, x.Description))
                .ToListAsync(cancellationToken),
            await _db.TenantPermissions
                .OrderBy(x => x.Category)
                .ThenBy(x => x.Name)
                .Select(x => new TenantPermissionDto(x.Id, x.Name, x.Category, x.Description))
                .ToListAsync(cancellationToken),
            assignments,
            rolePermissionIds,
            normalizedGrantedPermissionIds,
            normalizedDeniedPermissionIds);
    }

    public async Task<TenantRolesDto> GetRolesAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
    {
        var rolesQuery = _db.TenantRoles.AsQueryable();
        if (!string.IsNullOrWhiteSpace(query))
        {
            rolesQuery = rolesQuery.Where(x => x.Name.Contains(query) || x.Description.Contains(query));
        }

        rolesQuery = (sort, direction) switch
        {
            ("description", "desc") => rolesQuery.OrderByDescending(x => x.Description),
            ("description", _) => rolesQuery.OrderBy(x => x.Description),
            ("name", "desc") => rolesQuery.OrderByDescending(x => x.Name),
            _ => rolesQuery.OrderBy(x => x.Name)
        };

        var assignments = await _db.RolePermissionAssignments
            .GroupBy(x => x.RoleId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.PermissionId).ToHashSet(), cancellationToken);

        return new TenantRolesDto(
            await rolesQuery
                .Select(x => new TenantRoleDto(x.Id, x.Name, x.Description))
                .ToListAsync(cancellationToken),
            await _db.TenantPermissions
                .OrderBy(x => x.Category)
                .ThenBy(x => x.Name)
                .Select(x => new TenantPermissionDto(x.Id, x.Name, x.Category, x.Description))
                .ToListAsync(cancellationToken),
            assignments);
    }

    public async Task<IReadOnlyCollection<TenantPermissionDto>> GetPermissionsAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
    {
        var permissions = _db.TenantPermissions.AsQueryable();
        if (!string.IsNullOrWhiteSpace(query))
        {
            permissions = permissions.Where(x =>
                x.Name.Contains(query) ||
                x.Category.Contains(query) ||
                (x.Description != null && x.Description.Contains(query)));
        }

        permissions = (sort, direction) switch
        {
            ("name", "desc") => permissions.OrderByDescending(x => x.Name),
            ("name", _) => permissions.OrderBy(x => x.Name),
            ("description", "desc") => permissions.OrderByDescending(x => x.Description ?? string.Empty),
            ("description", _) => permissions.OrderBy(x => x.Description ?? string.Empty),
            ("category", "desc") => permissions.OrderByDescending(x => x.Category).ThenByDescending(x => x.Name),
            _ => permissions.OrderBy(x => x.Category).ThenBy(x => x.Name)
        };

        return await permissions
            .Select(x => new TenantPermissionDto(x.Id, x.Name, x.Category, x.Description))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ClientApplicationDto>> GetClientsAsync(CancellationToken cancellationToken = default)
    {
        return await _clientService.GetAllAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ExternalLoginProviderDto>> GetProvidersAsync(CancellationToken cancellationToken = default)
        => await _db.ExternalLoginProviders
            .OrderBy(x => x.DisplayName)
            .Select(x => new ExternalLoginProviderDto(
                x.Id,
                x.DisplayName,
                x.Authority,
                x.ClientId,
                x.Scopes,
                x.Enabled,
                x.AutoProvisionUsers))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<UserSessionDto>> GetSessionsAsync(CancellationToken cancellationToken = default)
        => await _db.UserSessions
            .Include(x => x.User)
            .OrderByDescending(x => x.LastSeenAt)
            .Select(x => new UserSessionDto(
                x.Id,
                x.UserId,
                x.User != null ? x.User.Email : null,
                x.SessionId,
                x.IpAddress,
                x.UserAgent,
                x.LastSeenAt,
                x.RevokedAt,
                x.RevokedAt == null))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<AdminAuditLogDto>> GetAuditLogsAsync(CancellationToken cancellationToken = default)
        => await _db.AuditLogs
            .OrderByDescending(x => x.CreatedAt)
            .Take(200)
            .Select(x => new AdminAuditLogDto(
                x.Id,
                x.CreatedAt,
                x.EventType,
                x.Result.ToString(),
                x.Result == AuditResult.Success,
                x.ActorType.ToString(),
                x.ActorUserId,
                x.TargetType,
                x.TargetId,
                x.IpAddress,
                x.TraceId))
            .ToListAsync(cancellationToken);

    public async Task<CommandResult> CreateUserAsync(string email, string displayName, string password, bool isTenantAdmin, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var user = new ApplicationUser
        {
            TenantId = _tenant.Id.Value,
            UserName = email,
            Email = email,
            DisplayName = displayName,
            IsTenantAdmin = isTenantAdmin,
            EmailConfirmed = false,
            IsEnabled = true
        };
        var result = await _userManager.CreateAsync(user, password);
        await _audit.WriteAsync("user.created", result.Succeeded ? AuditResult.Success : AuditResult.Failure, "user", user.Id.ToString(), cancellationToken: cancellationToken);
        return result.Succeeded
            ? CommandResult.Success()
            : CommandResult.Failure(result.Errors.Select(error => error.Description));
    }

    public async Task<CommandResult> DisableUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            return CommandResult.Missing();
        }

        var protectionResult = await ValidateUserCanLoseAdminAccessAsync(user, cancellationToken);
        if (protectionResult is not null)
        {
            return protectionResult;
        }

        user.IsEnabled = false;
        InvalidateAuthorization(user);
        foreach (var session in await _db.UserSessions.Where(x => x.UserId == id && x.RevokedAt == null).ToListAsync(cancellationToken))
        {
            session.RevokedAt = DateTimeOffset.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("user.disabled", AuditResult.Success, "user", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> EditUserAsync(Guid id, string email, string displayName, bool isEnabled, bool isTenantAdmin, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            return CommandResult.Missing();
        }

        if (user.IsBootstrapUser || user.IsSystemAdmin)
        {
            return CommandResult.Failure("Bootstrap and system administrator users cannot be edited from tenant administration.");
        }

        if (!isEnabled || !isTenantAdmin)
        {
            var protectionResult = await ValidateUserCanLoseAdminAccessAsync(user, cancellationToken);
            if (protectionResult is not null)
            {
                return protectionResult;
            }
        }

        user.Email = email;
        user.NormalizedEmail = email.ToUpperInvariant();
        user.UserName = email;
        user.NormalizedUserName = email.ToUpperInvariant();
        user.DisplayName = displayName;
        user.IsEnabled = isEnabled;
        user.IsTenantAdmin = isTenantAdmin;
        InvalidateAuthorization(user);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("user.updated", AuditResult.Success, "user", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            return CommandResult.Missing();
        }

        var protectionResult = await ValidateUserCanLoseAdminAccessAsync(user, cancellationToken);
        if (protectionResult is not null)
        {
            return protectionResult;
        }

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.UserId == id));
        _db.UserPermissionAssignments.RemoveRange(_db.UserPermissionAssignments.Where(x => x.UserId == id));
        _db.UserSessions.RemoveRange(_db.UserSessions.Where(x => x.UserId == id));
        await _userManager.DeleteAsync(user);
        await _audit.WriteAsync("user.deleted", AuditResult.Success, "user", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> SetUserRolesAsync(Guid userId, IReadOnlyCollection<Guid> roleIds, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var roleAssignmentResult = await ValidateBootstrapUserRoleAssignmentAsync(userId, roleIds, cancellationToken);
        if (roleAssignmentResult is not null)
        {
            return roleAssignmentResult;
        }

        var existing = await _db.UserRoleAssignments.Where(x => x.UserId == userId).ToListAsync(cancellationToken);
        _db.UserRoleAssignments.RemoveRange(existing);
        foreach (var roleId in roleIds.Distinct())
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
        }

        await InvalidateUserAuthorizationAsync(userId, cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("user_roles.updated", AuditResult.Success, "user", userId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> SetUserAccessAsync(
        Guid userId,
        IReadOnlyCollection<Guid> roleIds,
        IReadOnlyCollection<Guid> grantedPermissionIds,
        IReadOnlyCollection<Guid> deniedPermissionIds,
        CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        if (grantedPermissionIds.Intersect(deniedPermissionIds).Any())
        {
            return CommandResult.Failure("A permission cannot be both granted and denied.");
        }

        var userExists = await _db.Users.AnyAsync(x => x.Id == userId, cancellationToken);
        if (!userExists)
        {
            return CommandResult.Missing();
        }

        var roleAssignmentResult = await ValidateBootstrapUserRoleAssignmentAsync(userId, roleIds, cancellationToken);
        if (roleAssignmentResult is not null)
        {
            return roleAssignmentResult;
        }

        var existingRoles = await _db.UserRoleAssignments.Where(x => x.UserId == userId).ToListAsync(cancellationToken);
        _db.UserRoleAssignments.RemoveRange(existingRoles);
        foreach (var roleId in roleIds.Distinct())
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
        }

        var existingOverrides = await _db.UserPermissionAssignments.Where(x => x.UserId == userId).ToListAsync(cancellationToken);
        _db.UserPermissionAssignments.RemoveRange(existingOverrides);

        foreach (var permissionId in grantedPermissionIds.Distinct())
        {
            _db.UserPermissionAssignments.Add(new UserPermissionAssignment
            {
                TenantId = _tenant.Id.Value,
                UserId = userId,
                PermissionId = permissionId,
                IsGranted = true
            });
        }

        foreach (var permissionId in deniedPermissionIds.Distinct())
        {
            _db.UserPermissionAssignments.Add(new UserPermissionAssignment
            {
                TenantId = _tenant.Id.Value,
                UserId = userId,
                PermissionId = permissionId,
                IsGranted = false
            });
        }

        await InvalidateUserAuthorizationAsync(userId, cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("user_access.updated", AuditResult.Success, "user", userId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> CreateRoleAsync(string name, string description, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var role = new TenantRole { TenantId = _tenant.Id.Value, Name = name, Description = description };
        _db.TenantRoles.Add(role);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("role.created", AuditResult.Success, "role", role.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> EditRoleAsync(Guid id, string name, string description, CancellationToken cancellationToken = default)
    {
        var role = await _db.TenantRoles.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (role is null)
        {
            return CommandResult.Missing();
        }

        if (IsBootstrapRole(role))
        {
            return CommandResult.Failure("The TenantAdmin bootstrap role cannot be edited.");
        }

        role.Name = name;
        role.Description = description;
        role.UpdatedAt = DateTimeOffset.UtcNow;
        await InvalidateRoleUsersAsync(id, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("role.updated", AuditResult.Success, "role", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DeleteRoleAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var role = await _db.TenantRoles.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (role is null)
        {
            return CommandResult.Missing();
        }

        if (IsBootstrapRole(role))
        {
            return CommandResult.Failure("The TenantAdmin bootstrap role cannot be deleted.");
        }

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.RoleId == id));
        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.RoleId == id));
        _db.TenantRoles.Remove(role);
        await InvalidateRoleUsersAsync(id, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("role.deleted", AuditResult.Success, "role", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> AssignRoleAsync(Guid userId, Guid roleId, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        if (!await _db.UserRoleAssignments.AnyAsync(x => x.UserId == userId && x.RoleId == roleId, cancellationToken))
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
            await _db.SaveChangesAsync(cancellationToken);
        }

        await InvalidateUserAuthorizationAsync(userId, cancellationToken);

        await _audit.WriteAsync("user_role.assigned", AuditResult.Success, "user", userId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> CreatePermissionAsync(string name, string category, string? description, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        name = NormalizePermissionName(name);
        category = NormalizePermissionCategory(category);
        description = NormalizeOptional(description);

        var validationErrors = ValidatePermission(name, category);
        if (validationErrors.Count > 0)
        {
            return CommandResult.Failure(validationErrors);
        }

        var permission = new TenantPermission
        {
            TenantId = _tenant.Id.Value,
            Name = name,
            Category = category,
            Description = description
        };
        _db.TenantPermissions.Add(permission);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("permission.created", AuditResult.Success, "permission", permission.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> AssignPermissionAsync(Guid roleId, Guid permissionId, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        if (!await _db.RolePermissionAssignments.AnyAsync(x => x.RoleId == roleId && x.PermissionId == permissionId, cancellationToken))
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = _tenant.Id.Value, RoleId = roleId, PermissionId = permissionId });
            await _db.SaveChangesAsync(cancellationToken);
        }

        await InvalidateRoleUsersAsync(roleId, cancellationToken);

        await _audit.WriteAsync("role_permission.assigned", AuditResult.Success, "role", roleId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> SetRolePermissionsAsync(Guid roleId, IReadOnlyCollection<Guid> permissionIds, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var role = await _db.TenantRoles.FirstOrDefaultAsync(x => x.Id == roleId, cancellationToken);
        if (role is null)
        {
            return CommandResult.Missing();
        }

        if (IsBootstrapRole(role))
        {
            var requiredPermissionIds = await _db.TenantPermissions
                .Where(x => BootstrapPermissionNames.Contains(x.Name))
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
            if (requiredPermissionIds.Except(permissionIds).Any())
            {
                return CommandResult.Failure("The TenantAdmin bootstrap role must keep all platform management permissions.");
            }
        }

        var existing = await _db.RolePermissionAssignments.Where(x => x.RoleId == roleId).ToListAsync(cancellationToken);
        _db.RolePermissionAssignments.RemoveRange(existing);
        foreach (var permissionId in permissionIds.Distinct())
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = _tenant.Id.Value, RoleId = roleId, PermissionId = permissionId });
        }

        await InvalidateRoleUsersAsync(roleId, cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("role_permissions.updated", AuditResult.Success, "role", roleId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> EditPermissionAsync(Guid id, string name, string category, string? description, CancellationToken cancellationToken = default)
    {
        var permission = await _db.TenantPermissions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (permission is null)
        {
            return CommandResult.Missing();
        }

        if (IsBootstrapPermission(permission))
        {
            return CommandResult.Failure("Bootstrap platform permissions cannot be edited.");
        }

        name = NormalizePermissionName(name);
        category = NormalizePermissionCategory(category);
        description = NormalizeOptional(description);

        var validationErrors = ValidatePermission(name, category);
        if (validationErrors.Count > 0)
        {
            return CommandResult.Failure(validationErrors);
        }

        permission.Name = name;
        permission.Category = category;
        permission.Description = description;
        permission.UpdatedAt = DateTimeOffset.UtcNow;
        await InvalidatePermissionUsersAsync(id, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("permission.updated", AuditResult.Success, "permission", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DeletePermissionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var permission = await _db.TenantPermissions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (permission is null)
        {
            return CommandResult.Missing();
        }

        if (IsBootstrapPermission(permission))
        {
            return CommandResult.Failure("Bootstrap platform permissions cannot be deleted.");
        }

        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.PermissionId == id));
        _db.UserPermissionAssignments.RemoveRange(_db.UserPermissionAssignments.Where(x => x.PermissionId == id));
        _db.TenantPermissions.Remove(permission);
        await InvalidatePermissionUsersAsync(id, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("permission.deleted", AuditResult.Success, "permission", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    private async Task<CommandResult?> ValidateUserCanLoseAdminAccessAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        if (user.IsBootstrapUser || user.IsSystemAdmin)
        {
            return CommandResult.Failure("Bootstrap and system administrator users cannot be disabled or deleted from tenant administration.");
        }

        if (!user.IsTenantAdmin)
        {
            return null;
        }

        var hasAnotherEnabledTenantAdmin = await _db.Users.AnyAsync(
            x => x.Id != user.Id && x.IsEnabled && x.IsTenantAdmin,
            cancellationToken);
        return hasAnotherEnabledTenantAdmin
            ? null
            : CommandResult.Failure("A tenant must retain at least one enabled tenant administrator.");
    }

    private async Task<CommandResult?> ValidateBootstrapUserRoleAssignmentAsync(
        Guid userId,
        IReadOnlyCollection<Guid> roleIds,
        CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is null)
        {
            return CommandResult.Missing();
        }

        if (!user.IsBootstrapUser)
        {
            return null;
        }

        var tenantAdminRoleId = await _db.TenantRoles
            .Where(x => x.Name == TenantAdminRoleName)
            .Select(x => (Guid?)x.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (!tenantAdminRoleId.HasValue)
        {
            return CommandResult.Failure("The TenantAdmin bootstrap role is missing.");
        }

        return roleIds.Contains(tenantAdminRoleId.Value)
            ? null
            : CommandResult.Failure("Bootstrap users must keep the TenantAdmin role.");
    }

    private static bool IsBootstrapRole(TenantRole role)
        => string.Equals(role.Name, TenantAdminRoleName, StringComparison.Ordinal);

    private static bool IsBootstrapPermission(TenantPermission permission)
        => BootstrapPermissionNames.Contains(permission.Name);

    private async Task InvalidateUserAuthorizationAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is not null)
        {
            InvalidateAuthorization(user);
        }
    }

    private async Task InvalidateRoleUsersAsync(Guid roleId, CancellationToken cancellationToken)
    {
        var userIds = await _db.UserRoleAssignments
            .Where(x => x.RoleId == roleId)
            .Select(x => x.UserId)
            .ToListAsync(cancellationToken);
        foreach (var user in await _db.Users.Where(x => userIds.Contains(x.Id)).ToListAsync(cancellationToken))
        {
            InvalidateAuthorization(user);
        }
    }

    private async Task InvalidatePermissionUsersAsync(Guid permissionId, CancellationToken cancellationToken)
    {
        var roleUserIds = await _db.RolePermissionAssignments
            .Where(x => x.PermissionId == permissionId)
            .Join(_db.UserRoleAssignments, rolePermission => rolePermission.RoleId, userRole => userRole.RoleId, (_, userRole) => userRole.UserId)
            .ToListAsync(cancellationToken);
        var directUserIds = await _db.UserPermissionAssignments
            .Where(x => x.PermissionId == permissionId)
            .Select(x => x.UserId)
            .ToListAsync(cancellationToken);
        var userIds = roleUserIds.Concat(directUserIds).Distinct().ToArray();
        foreach (var user in await _db.Users.Where(x => userIds.Contains(x.Id)).ToListAsync(cancellationToken))
        {
            InvalidateAuthorization(user);
        }
    }

    private static void InvalidateAuthorization(ApplicationUser user)
    {
        user.AuthorizationVersion++;
        user.SecurityStamp = Guid.NewGuid().ToString("N");
    }

    public async Task<CreateClientResult> CreateClientAsync(string name, string clientId, ClientType type, string[] redirectUris, string[] postLogoutRedirectUris, string scopes, string flows, CancellationToken cancellationToken = default)
    {
        var result = await _clientService.CreateAsync(name, clientId, type, redirectUris, postLogoutRedirectUris, scopes, flows, cancellationToken);
        
        if (result.Succeeded)
        {
            await _audit.WriteAsync("client.created", AuditResult.Success, "client", clientId, cancellationToken: cancellationToken);
        }
        
        return result;
    }

    public async Task<CommandResult> EditClientAsync(Guid id, string name, ClientType type, string[] redirectUris, string[] postLogoutRedirectUris, string scopes, string flows, bool enabled, CancellationToken cancellationToken = default)
    {
        // We need to find clientId by id first
        var clients = await _clientService.GetAllAsync(cancellationToken);
        var client = clients.FirstOrDefault(c => c.Id == id.ToString());
        
        if (client is null)
        {
            return CommandResult.Missing();
        }

        var result = await _clientService.UpdateAsync(client.ClientId, name, type, redirectUris, postLogoutRedirectUris, scopes, flows, enabled, cancellationToken);
        
        if (result.Succeeded)
        {
            await _audit.WriteAsync("client.updated", AuditResult.Success, "client", id.ToString(), cancellationToken: cancellationToken);
        }
        
        return result;
    }

    public async Task<CommandResult> DeleteClientAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var clients = await _clientService.GetAllAsync(cancellationToken);
        var client = clients.FirstOrDefault(c => c.Id == id.ToString());
        
        if (client is null)
        {
            return CommandResult.Missing();
        }

        var result = await _clientService.DeleteAsync(client.ClientId, cancellationToken);
        
        if (result.Succeeded)
        {
            await _audit.WriteAsync("client.deleted", AuditResult.Success, "client", id.ToString(), cancellationToken: cancellationToken);
        }
        
        return result;
    }

    public async Task<CommandResult> CreateProviderAsync(string displayName, string authority, string clientId, string clientSecret, string scopes, bool autoProvisionUsers, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var provider = new ExternalLoginProvider
        {
            TenantId = _tenant.Id.Value,
            DisplayName = displayName,
            Authority = authority,
            ClientId = clientId,
            ClientSecretProtected = string.IsNullOrWhiteSpace(clientSecret) ? null : _secrets.Protect(clientSecret),
            Scopes = scopes,
            AutoProvisionUsers = autoProvisionUsers
        };
        _db.ExternalLoginProviders.Add(provider);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("login_provider.created", AuditResult.Success, "provider", provider.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> UpsertSmtpAsync(string host, int port, string? username, string? password, bool useTls, string fromEmail, string fromDisplayName, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var settings = await _db.TenantSmtpSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            settings = new TenantSmtpSettings { TenantId = _tenant.Id.Value };
            _db.TenantSmtpSettings.Add(settings);
        }

        settings.Host = host;
        settings.Port = port;
        settings.Username = username;
        settings.PasswordProtected = string.IsNullOrWhiteSpace(password) ? settings.PasswordProtected : _secrets.Protect(password);
        settings.UseTls = useTls;
        settings.FromEmail = fromEmail;
        settings.FromDisplayName = fromDisplayName;
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("smtp.updated", AuditResult.Success, "smtp", settings.Id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> RevokeSessionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var session = await _db.UserSessions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (session is null)
        {
            return CommandResult.Missing();
        }

        session.RevokedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        return CommandResult.Success();
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string NormalizePermissionName(string value)
    {
        return NormalizePermissionSegments(value, '.');
    }

    private static string NormalizePermissionCategory(string value)
    {
        return NormalizePermissionSegments(value, '.');
    }

    private static string NormalizePermissionSegments(string value, char separator)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var segments = value
            .Split(['.', '/', '\\', ':', '>', '|'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(segment => !string.IsNullOrWhiteSpace(segment))
            .Select(segment => segment.ToLowerInvariant());

        return string.Join(separator, segments);
    }

    private static List<string> ValidatePermission(string name, string category)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(name))
        {
            errors.Add("Permission name is required.");
        }
        else if (!IsValidPermissionPath(name))
        {
            errors.Add("Permission name must use lowercase segments separated by dots.");
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            errors.Add("Category is required.");
        }
        else if (!IsValidPermissionPath(category))
        {
            errors.Add("Category must use lowercase segments separated by dots.");
        }

        return errors;
    }

    private static bool IsValidPermissionPath(string value)
    {
        var segments = value.Split('.', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (segments.Length == 0)
        {
            return false;
        }

        return segments.All(segment => segment.All(character =>
            char.IsLower(character) ||
            char.IsDigit(character) ||
            character is '-' or '_'));
    }
}
