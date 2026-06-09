using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Web.Controllers;

[Authorize(Policy = "tenant-admin")]
[Route("tenant-admin")]
public sealed class TenantAdminController : Controller
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICurrentTenant _tenant;
    private readonly ISecretService _secrets;
    private readonly IAuditService _audit;

    public TenantAdminController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, ICurrentTenant tenant, ISecretService secrets, IAuditService audit)
    {
        _db = db;
        _userManager = userManager;
        _tenant = tenant;
        _secrets = secrets;
        _audit = audit;
    }

    [HttpGet("")]
    public async Task<IActionResult> Dashboard()
    {
        var model = new TenantAdminDashboard(
            await _db.Users.CountAsync(),
            await _db.TenantRoles.CountAsync(),
            await _db.TenantPermissions.CountAsync(),
            await _db.ClientApplications.CountAsync(),
            await _db.ExternalLoginProviders.CountAsync(),
            await _db.UserSessions.CountAsync(),
            await _db.AuditLogs.OrderByDescending(x => x.CreatedAt).Take(25).ToListAsync());

        return View(model);
    }

    [HttpGet("users")]
    public async Task<IActionResult> Users(string? q = null, string sort = "email", string dir = "asc")
    {
        var usersQuery = _db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            usersQuery = usersQuery.Where(x =>
                (x.Email != null && x.Email.Contains(q)) ||
                x.DisplayName.Contains(q));
        }

        usersQuery = (sort, dir) switch
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
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.RoleId).ToHashSet());

        var model = new TenantUsersPage(
            await usersQuery.ToListAsync(),
            await _db.TenantRoles.OrderBy(x => x.Name).ToListAsync(),
            assignments,
            q,
            sort,
            dir);
        return View(model);
    }

    [HttpPost("users")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateUser(string email, string displayName, string password, bool isTenantAdmin = false)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
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
        await _audit.WriteAsync("user.created", result.Succeeded ? AuditResult.Success : AuditResult.Failure, "user", user.Id.ToString());
        return result.Succeeded ? RedirectToAction(nameof(Users)) : BadRequest(result.Errors);
    }

    [HttpPost("users/{id:guid}/disable")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        user.IsEnabled = false;
        foreach (var session in await _db.UserSessions.Where(x => x.UserId == id && x.RevokedAt == null).ToListAsync())
        {
            session.RevokedAt = DateTimeOffset.UtcNow;
        }
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("user.disabled", AuditResult.Success, "user", id.ToString());
        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditUser(Guid id, string email, string displayName, bool isEnabled, bool isTenantAdmin)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        user.Email = email;
        user.NormalizedEmail = email.ToUpperInvariant();
        user.UserName = email;
        user.NormalizedUserName = email.ToUpperInvariant();
        user.DisplayName = displayName;
        user.IsEnabled = isEnabled;
        user.IsTenantAdmin = isTenantAdmin;
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("user.updated", AuditResult.Success, "user", id.ToString());
        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.UserId == id));
        _db.UserSessions.RemoveRange(_db.UserSessions.Where(x => x.UserId == id));
        await _userManager.DeleteAsync(user);
        await _audit.WriteAsync("user.deleted", AuditResult.Success, "user", id.ToString());
        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{userId:guid}/roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetUserRoles(Guid userId, Guid[]? roleIds)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var existing = await _db.UserRoleAssignments.Where(x => x.UserId == userId).ToListAsync();
        _db.UserRoleAssignments.RemoveRange(existing);
        foreach (var roleId in (roleIds ?? Array.Empty<Guid>()).Distinct())
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
        }

        await _db.SaveChangesAsync();
        await _audit.WriteAsync("user_roles.updated", AuditResult.Success, "user", userId.ToString());
        return RedirectToAction(nameof(Users));
    }

    [HttpGet("roles")]
    public async Task<IActionResult> Roles(string? q = null, string sort = "name", string dir = "asc")
    {
        var rolesQuery = _db.TenantRoles.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            rolesQuery = rolesQuery.Where(x => x.Name.Contains(q) || x.Description.Contains(q));
        }

        rolesQuery = (sort, dir) switch
        {
            ("description", "desc") => rolesQuery.OrderByDescending(x => x.Description),
            ("description", _) => rolesQuery.OrderBy(x => x.Description),
            ("name", "desc") => rolesQuery.OrderByDescending(x => x.Name),
            _ => rolesQuery.OrderBy(x => x.Name)
        };

        var assignments = await _db.RolePermissionAssignments
            .GroupBy(x => x.RoleId)
            .ToDictionaryAsync(x => x.Key, x => x.Select(a => a.PermissionId).ToHashSet());

        var model = new TenantRolesPage(
            await rolesQuery.ToListAsync(),
            await _db.TenantPermissions.OrderBy(x => x.Category).ThenBy(x => x.Name).ToListAsync(),
            assignments,
            q,
            sort,
            dir);
        return View(model);
    }

    [HttpPost("roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateRole(string name, string description)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var role = new TenantRole { TenantId = _tenant.Id.Value, Name = name, Description = description };
        _db.TenantRoles.Add(role);
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("role.created", AuditResult.Success, "role", role.Id.ToString());
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditRole(Guid id, string name, string description)
    {
        var role = await _db.TenantRoles.FirstOrDefaultAsync(x => x.Id == id);
        if (role is null)
        {
            return NotFound();
        }

        role.Name = name;
        role.Description = description;
        role.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("role.updated", AuditResult.Success, "role", id.ToString());
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var role = await _db.TenantRoles.FirstOrDefaultAsync(x => x.Id == id);
        if (role is null)
        {
            return NotFound();
        }

        _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.RoleId == id));
        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.RoleId == id));
        _db.TenantRoles.Remove(role);
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("role.deleted", AuditResult.Success, "role", id.ToString());
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("users/{userId:guid}/roles/{roleId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignRole(Guid userId, Guid roleId)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        if (!await _db.UserRoleAssignments.AnyAsync(x => x.UserId == userId && x.RoleId == roleId))
        {
            _db.UserRoleAssignments.Add(new UserRoleAssignment { TenantId = _tenant.Id.Value, UserId = userId, RoleId = roleId });
            await _db.SaveChangesAsync();
        }

        await _audit.WriteAsync("user_role.assigned", AuditResult.Success, "user", userId.ToString());
        return RedirectToAction(nameof(Users));
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> Permissions(string? q = null, string sort = "category", string dir = "asc")
    {
        var query = _db.TenantPermissions.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            query = query.Where(x =>
                x.Name.Contains(q) ||
                x.Category.Contains(q) ||
                (x.Description != null && x.Description.Contains(q)));
        }

        query = (sort, dir) switch
        {
            ("name", "desc") => query.OrderByDescending(x => x.Name),
            ("name", _) => query.OrderBy(x => x.Name),
            ("description", "desc") => query.OrderByDescending(x => x.Description ?? string.Empty),
            ("description", _) => query.OrderBy(x => x.Description ?? string.Empty),
            ("category", "desc") => query.OrderByDescending(x => x.Category).ThenByDescending(x => x.Name),
            _ => query.OrderBy(x => x.Category).ThenBy(x => x.Name)
        };

        return View(new TenantPermissionsPage(await query.ToListAsync(), q, sort, dir));
    }

    [HttpPost("permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreatePermission(string name, string category, string? description)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        if (!ValidatePermission(name, category))
        {
            return View("Permissions", await BuildPermissionsPageAsync());
        }

        var permission = new TenantPermission { TenantId = _tenant.Id.Value, Name = name.Trim(), Category = category.Trim(), Description = NormalizeOptional(description) };
        _db.TenantPermissions.Add(permission);
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("permission.created", AuditResult.Success, "permission", permission.Id.ToString());
        return RedirectToAction(nameof(Permissions));
    }

    [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignPermission(Guid roleId, Guid permissionId)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        if (!await _db.RolePermissionAssignments.AnyAsync(x => x.RoleId == roleId && x.PermissionId == permissionId))
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = _tenant.Id.Value, RoleId = roleId, PermissionId = permissionId });
            await _db.SaveChangesAsync();
        }

        await _audit.WriteAsync("role_permission.assigned", AuditResult.Success, "role", roleId.ToString());
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{roleId:guid}/permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetRolePermissions(Guid roleId, Guid[]? permissionIds)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var existing = await _db.RolePermissionAssignments.Where(x => x.RoleId == roleId).ToListAsync();
        _db.RolePermissionAssignments.RemoveRange(existing);
        foreach (var permissionId in (permissionIds ?? Array.Empty<Guid>()).Distinct())
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment { TenantId = _tenant.Id.Value, RoleId = roleId, PermissionId = permissionId });
        }

        await _db.SaveChangesAsync();
        await _audit.WriteAsync("role_permissions.updated", AuditResult.Success, "role", roleId.ToString());
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("permissions/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditPermission(Guid id, string name, string category, string? description)
    {
        var permission = await _db.TenantPermissions.FirstOrDefaultAsync(x => x.Id == id);
        if (permission is null)
        {
            return NotFound();
        }

        if (!ValidatePermission(name, category))
        {
            return View("Permissions", await BuildPermissionsPageAsync());
        }

        permission.Name = name.Trim();
        permission.Category = category.Trim();
        permission.Description = NormalizeOptional(description);
        permission.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("permission.updated", AuditResult.Success, "permission", id.ToString());
        return RedirectToAction(nameof(Permissions));
    }

    [HttpPost("permissions/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeletePermission(Guid id)
    {
        var permission = await _db.TenantPermissions.FirstOrDefaultAsync(x => x.Id == id);
        if (permission is null)
        {
            return NotFound();
        }

        _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.PermissionId == id));
        _db.TenantPermissions.Remove(permission);
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("permission.deleted", AuditResult.Success, "permission", id.ToString());
        return RedirectToAction(nameof(Permissions));
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private bool ValidatePermission(string name, string category)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            ModelState.AddModelError("name", "Permission name is required.");
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            ModelState.AddModelError("category", "Category is required.");
        }

        return ModelState.IsValid;
    }

    private async Task<TenantPermissionsPage> BuildPermissionsPageAsync()
    {
        return new TenantPermissionsPage(
            await _db.TenantPermissions.OrderBy(x => x.Category).ThenBy(x => x.Name).ToListAsync(),
            null,
            "category",
            "asc");
    }

    [HttpGet("clients")]
    public async Task<IActionResult> Clients() => View(await _db.ClientApplications.Include(x => x.RedirectUris).OrderBy(x => x.Name).ToListAsync());

    [HttpPost("clients")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateClient(string name, string clientId, ClientType type, string redirectUri, string scopes, string flows)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var plainSecret = type == ClientType.Service || type == ClientType.Web ? _secrets.GenerateSecret() : null;
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

        await _db.SaveChangesAsync();
        await _audit.WriteAsync("client.created", AuditResult.Success, "client", client.Id.ToString());
        TempData["ClientSecret"] = plainSecret;
        TempData["ClientId"] = client.ClientId;
        return RedirectToAction(nameof(Clients));
    }

    [HttpGet("providers")]
    public async Task<IActionResult> Providers() => View(await _db.ExternalLoginProviders.OrderBy(x => x.DisplayName).ToListAsync());

    [HttpPost("providers")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProvider(string displayName, string authority, string clientId, string clientSecret, string scopes, bool autoProvisionUsers)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
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
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("login_provider.created", AuditResult.Success, "provider", provider.Id.ToString());
        return RedirectToAction(nameof(Providers));
    }

    [HttpPost("smtp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpsertSmtp(string host, int port, string? username, string? password, bool useTls, string fromEmail, string fromDisplayName)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var settings = await _db.TenantSmtpSettings.FirstOrDefaultAsync();
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
        await _db.SaveChangesAsync();
        await _audit.WriteAsync("smtp.updated", AuditResult.Success, "smtp", settings.Id.ToString());
        return RedirectToAction(nameof(Providers));
    }

    [HttpGet("sessions")]
    public async Task<IActionResult> Sessions() => View(await _db.UserSessions.Include(x => x.User).OrderByDescending(x => x.LastSeenAt).ToListAsync());

    [HttpPost("sessions/{id:guid}/revoke")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RevokeSession(Guid id)
    {
        var session = await _db.UserSessions.FirstOrDefaultAsync(x => x.Id == id);
        if (session is null)
        {
            return NotFound();
        }

        session.RevokedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Sessions));
    }

    [HttpGet("audit")]
    public async Task<IActionResult> Audit() => View(await _db.AuditLogs.OrderByDescending(x => x.CreatedAt).Take(200).ToListAsync());
}

public sealed record TenantAdminDashboard(
    int Users,
    int Roles,
    int Permissions,
    int Clients,
    int Providers,
    int Sessions,
    IReadOnlyCollection<Domain.AuditLog> RecentAuditLogs);

public sealed record TenantUsersPage(
    IReadOnlyCollection<ApplicationUser> Users,
    IReadOnlyCollection<TenantRole> Roles,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedRoleIds,
    string? Query,
    string Sort,
    string Direction);

public sealed record TenantRolesPage(
    IReadOnlyCollection<TenantRole> Roles,
    IReadOnlyCollection<TenantPermission> Permissions,
    IReadOnlyDictionary<Guid, HashSet<Guid>> AssignedPermissionIds,
    string? Query,
    string Sort,
    string Direction);

public sealed record TenantPermissionsPage(
    IReadOnlyCollection<TenantPermission> Permissions,
    string? Query,
    string Sort,
    string Direction);
