using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Infrastructure;

internal sealed class TenantAdminApplicationService : ITenantAdminQueries, ITenantAdminCommands
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICurrentTenant _tenant;
    private readonly ISecretService _secrets;
    private readonly IAuditService _audit;

    public TenantAdminApplicationService(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager,
        ICurrentTenant tenant,
        ISecretService secrets,
        IAuditService audit)
    {
        _db = db;
        _userManager = userManager;
        _tenant = tenant;
        _secrets = secrets;
        _audit = audit;
    }

    public async Task<TenantAdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        return new TenantAdminDashboardDto(
            await _db.Users.CountAsync(cancellationToken),
            await _db.TenantRoles.CountAsync(cancellationToken),
            await _db.TenantPermissions.CountAsync(cancellationToken),
            await _db.ClientApplications.CountAsync(cancellationToken),
            await _db.ExternalLoginProviders.CountAsync(cancellationToken),
            await _db.UserSessions.CountAsync(cancellationToken),
            await _db.AuditLogs.OrderByDescending(x => x.CreatedAt).Take(25).ToListAsync(cancellationToken));
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

        return new TenantUsersDto(
            await usersQuery.ToListAsync(cancellationToken),
            await _db.TenantRoles.OrderBy(x => x.Name).ToListAsync(cancellationToken),
            assignments);
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
            await rolesQuery.ToListAsync(cancellationToken),
            await _db.TenantPermissions.OrderBy(x => x.Category).ThenBy(x => x.Name).ToListAsync(cancellationToken),
            assignments);
    }

    public async Task<IReadOnlyCollection<TenantPermission>> GetPermissionsAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
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

        return await permissions.ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ClientApplication>> GetClientsAsync(CancellationToken cancellationToken = default)
        => await _db.ClientApplications.Include(x => x.RedirectUris).OrderBy(x => x.Name).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<ExternalLoginProvider>> GetProvidersAsync(CancellationToken cancellationToken = default)
        => await _db.ExternalLoginProviders.OrderBy(x => x.DisplayName).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<UserSession>> GetSessionsAsync(CancellationToken cancellationToken = default)
        => await _db.UserSessions.Include(x => x.User).OrderByDescending(x => x.LastSeenAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<AuditLog>> GetAuditLogsAsync(CancellationToken cancellationToken = default)
        => await _db.AuditLogs.OrderByDescending(x => x.CreatedAt).Take(200).ToListAsync(cancellationToken);

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

        user.IsEnabled = false;
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

        user.Email = email;
        user.NormalizedEmail = email.ToUpperInvariant();
        user.UserName = email;
        user.NormalizedUserName = email.ToUpperInvariant();
        user.DisplayName = displayName;
        user.IsEnabled = isEnabled;
        user.IsTenantAdmin = isTenantAdmin;
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

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.UserId == id));
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

        var existing = await _db.UserRoleAssignments.Where(x => x.UserId == userId).ToListAsync(cancellationToken);
        _db.UserRoleAssignments.RemoveRange(existing);
        foreach (var roleId in roleIds.Distinct())
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
        }

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("user_roles.updated", AuditResult.Success, "user", userId.ToString(), cancellationToken: cancellationToken);
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

        role.Name = name;
        role.Description = description;
        role.UpdatedAt = DateTimeOffset.UtcNow;
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

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.RoleId == id));
        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.RoleId == id));
        _db.TenantRoles.Remove(role);
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

        await _audit.WriteAsync("user_role.assigned", AuditResult.Success, "user", userId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> CreatePermissionAsync(string name, string category, string? description, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var validationErrors = ValidatePermission(name, category);
        if (validationErrors.Count > 0)
        {
            return CommandResult.Failure(validationErrors);
        }

        var permission = new TenantPermission
        {
            TenantId = _tenant.Id.Value,
            Name = name.Trim(),
            Category = category.Trim(),
            Description = NormalizeOptional(description)
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

        await _audit.WriteAsync("role_permission.assigned", AuditResult.Success, "role", roleId.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> SetRolePermissionsAsync(Guid roleId, IReadOnlyCollection<Guid> permissionIds, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CommandResult.Failure("Tenant is required.");
        }

        var existing = await _db.RolePermissionAssignments.Where(x => x.RoleId == roleId).ToListAsync(cancellationToken);
        _db.RolePermissionAssignments.RemoveRange(existing);
        foreach (var permissionId in permissionIds.Distinct())
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = _tenant.Id.Value, RoleId = roleId, PermissionId = permissionId });
        }

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

        var validationErrors = ValidatePermission(name, category);
        if (validationErrors.Count > 0)
        {
            return CommandResult.Failure(validationErrors);
        }

        permission.Name = name.Trim();
        permission.Category = category.Trim();
        permission.Description = NormalizeOptional(description);
        permission.UpdatedAt = DateTimeOffset.UtcNow;
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

        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.PermissionId == id));
        _db.TenantPermissions.Remove(permission);
        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("permission.deleted", AuditResult.Success, "permission", id.ToString(), cancellationToken: cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CreateClientResult> CreateClientAsync(string name, string clientId, ClientType type, string redirectUri, string scopes, string flows, CancellationToken cancellationToken = default)
    {
        if (!_tenant.Id.HasValue)
        {
            return CreateClientResult.Failure("Tenant is required.");
        }

        var plainSecret = type is ClientType.Service or ClientType.Web ? _secrets.GenerateSecret() : null;
        var client = new ClientApplication
        {
            TenantId = _tenant.Id.Value,
            Name = name,
            ClientId = clientId,
            Type = type,
            SecretHash = plainSecret is null ? null : _secrets.HashSecret(plainSecret),
            AllowedScopes = scopes,
            AllowedFlows = flows,
            RefreshTokensEnabled = flows.Contains("refresh_token", StringComparison.OrdinalIgnoreCase)
        };

        _db.ClientApplications.Add(client);
        if (!string.IsNullOrWhiteSpace(redirectUri))
        {
            _db.ClientRedirectUris.Add(new ClientRedirectUri { TenantId = _tenant.Id.Value, ClientApplication = client, Uri = redirectUri });
        }

        await _db.SaveChangesAsync(cancellationToken);
        await _audit.WriteAsync("client.created", AuditResult.Success, "client", client.Id.ToString(), cancellationToken: cancellationToken);
        return CreateClientResult.Success(client.ClientId, plainSecret);
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
            ClientSecretProtected = string.IsNullOrWhiteSpace(clientSecret) ? null : _secrets.HashSecret(clientSecret),
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
        settings.PasswordProtected = string.IsNullOrWhiteSpace(password) ? settings.PasswordProtected : _secrets.HashSecret(password);
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

    private static List<string> ValidatePermission(string name, string category)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(name))
        {
            errors.Add("Permission name is required.");
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            errors.Add("Category is required.");
        }

        return errors;
    }
}
