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
    public async Task<IActionResult> Users()
    {
        var model = new TenantUsersPage(
            await _db.Users.OrderBy(x => x.Email).ToListAsync(),
            await _db.TenantRoles.OrderBy(x => x.Name).ToListAsync());
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

    [HttpGet("roles")]
    public async Task<IActionResult> Roles()
    {
        var model = new TenantRolesPage(
            await _db.TenantRoles.OrderBy(x => x.Name).ToListAsync(),
            await _db.TenantPermissions.OrderBy(x => x.Name).ToListAsync());
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
    public async Task<IActionResult> Permissions() => View(await _db.TenantPermissions.OrderBy(x => x.Category).ThenBy(x => x.Name).ToListAsync());

    [HttpPost("permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreatePermission(string name, string category, string description)
    {
        if (!_tenant.Id.HasValue)
        {
            return BadRequest("Tenant is required.");
        }

        var permission = new TenantPermission { TenantId = _tenant.Id.Value, Name = name, Category = category, Description = description };
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
    IReadOnlyCollection<TenantRole> Roles);

public sealed record TenantRolesPage(
    IReadOnlyCollection<TenantRole> Roles,
    IReadOnlyCollection<TenantPermission> Permissions);
