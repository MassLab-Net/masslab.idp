using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Web.Domain;
using MediatR;

namespace MassLab.Identity.Web.Controllers;

[Authorize(Policy = "tenant-admin")]
[Route("tenant-admin")]
public sealed class TenantAdminController : Controller
{
    private readonly ISender _sender;

    public TenantAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("")]
    public async Task<IActionResult> Dashboard()
    {
        var result = await _sender.Send(new GetTenantDashboardQuery());
        var model = new TenantAdminDashboard(result.Users, result.Roles, result.Permissions, result.Clients, result.Providers, result.Sessions, result.RecentAuditLogs);

        return View(model);
    }

    [HttpGet("users")]
    public async Task<IActionResult> Users(string? q = null, string sort = "email", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantUsersQuery(q, sort, dir));
        var model = new TenantUsersPage(result.Users, result.Roles, result.AssignedRoleIds, q, sort, dir);
        return View(model);
    }

    [HttpPost("users")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateUser(string email, string displayName, string password, bool isTenantAdmin = false)
    {
        var result = await _sender.Send(new CreateTenantUserCommand(email, displayName, password, isTenantAdmin));
        return result.Succeeded ? RedirectToAction(nameof(Users)) : BadRequest(result.Errors);
    }

    [HttpPost("users/{id:guid}/disable")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        var result = await _sender.Send(new DisableTenantUserCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditUser(Guid id, string email, string displayName, bool isEnabled, bool isTenantAdmin)
    {
        var result = await _sender.Send(new EditTenantUserCommand(id, email, displayName, isEnabled, isTenantAdmin));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _sender.Send(new DeleteTenantUserCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{userId:guid}/roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetUserRoles(Guid userId, Guid[]? roleIds)
    {
        var result = await _sender.Send(new SetTenantUserRolesCommand(userId, (roleIds ?? Array.Empty<Guid>()).Distinct().ToArray()));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpGet("roles")]
    public async Task<IActionResult> Roles(string? q = null, string sort = "name", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantRolesQuery(q, sort, dir));
        var model = new TenantRolesPage(result.Roles, result.Permissions, result.AssignedPermissionIds, q, sort, dir);
        return View(model);
    }

    [HttpPost("roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateRole(string name, string description)
    {
        var result = await _sender.Send(new CreateTenantRoleCommand(name, description));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditRole(Guid id, string name, string description)
    {
        var result = await _sender.Send(new EditTenantRoleCommand(id, name, description));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var result = await _sender.Send(new DeleteTenantRoleCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("users/{userId:guid}/roles/{roleId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignRole(Guid userId, Guid roleId)
    {
        await _sender.Send(new AssignTenantRoleCommand(userId, roleId));
        return RedirectToAction(nameof(Users));
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> Permissions(string? q = null, string sort = "category", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantPermissionsQuery(q, sort, dir));
        return View(new TenantPermissionsPage(result, q, sort, dir));
    }

    [HttpPost("permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreatePermission(string name, string category, string? description)
    {
        var result = await _sender.Send(new CreateTenantPermissionCommand(name, category, description));
        if (!result.Succeeded)
        {
            return View("Permissions", new TenantPermissionsPage(await _sender.Send(new GetTenantPermissionsQuery(null, "category", "asc")), null, "category", "asc"));
        }

        return RedirectToAction(nameof(Permissions));
    }

    [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignPermission(Guid roleId, Guid permissionId)
    {
        await _sender.Send(new AssignTenantPermissionCommand(roleId, permissionId));
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{roleId:guid}/permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetRolePermissions(Guid roleId, Guid[]? permissionIds)
    {
        await _sender.Send(new SetTenantRolePermissionsCommand(roleId, (permissionIds ?? Array.Empty<Guid>()).Distinct().ToArray()));
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("permissions/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditPermission(Guid id, string name, string category, string? description)
    {
        var result = await _sender.Send(new EditTenantPermissionCommand(id, name, category, description));
        if (result.NotFound)
        {
            return NotFound();
        }

        if (!result.Succeeded)
        {
            return View("Permissions", new TenantPermissionsPage(await _sender.Send(new GetTenantPermissionsQuery(null, "category", "asc")), null, "category", "asc"));
        }

        return RedirectToAction(nameof(Permissions));
    }

    [HttpPost("permissions/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeletePermission(Guid id)
    {
        var result = await _sender.Send(new DeleteTenantPermissionCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Permissions));
    }

    [HttpGet("clients")]
    public async Task<IActionResult> Clients() => View(await _sender.Send(new GetTenantClientsQuery()));

    [HttpPost("clients")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateClient(string name, string clientId, ClientType type, string redirectUri, string scopes, string flows)
    {
        var result = await _sender.Send(new CreateTenantClientCommand(name, clientId, type, redirectUri, scopes, flows));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        TempData["ClientSecret"] = result.ClientSecret;
        TempData["ClientId"] = result.ClientId;
        return RedirectToAction(nameof(Clients));
    }

    [HttpGet("providers")]
    public async Task<IActionResult> Providers() => View(await _sender.Send(new GetTenantProvidersQuery()));

    [HttpPost("providers")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProvider(string displayName, string authority, string clientId, string clientSecret, string scopes, bool autoProvisionUsers)
    {
        var result = await _sender.Send(new CreateTenantProviderCommand(displayName, authority, clientId, clientSecret, scopes, autoProvisionUsers));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Providers));
    }

    [HttpPost("smtp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpsertSmtp(string host, int port, string? username, string? password, bool useTls, string fromEmail, string fromDisplayName)
    {
        var result = await _sender.Send(new UpsertTenantSmtpCommand(host, port, username, password, useTls, fromEmail, fromDisplayName));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Providers));
    }

    [HttpGet("sessions")]
    public async Task<IActionResult> Sessions() => View(await _sender.Send(new GetTenantSessionsQuery()));

    [HttpPost("sessions/{id:guid}/revoke")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RevokeSession(Guid id)
    {
        var result = await _sender.Send(new RevokeTenantSessionCommand(id));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Sessions));
    }

    [HttpGet("audit")]
    public async Task<IActionResult> Audit() => View(await _sender.Send(new GetTenantAuditLogsQuery()));
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
