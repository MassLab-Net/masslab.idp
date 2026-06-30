using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Domain;
using MassLab.Identity.Web.Routing;
using MassLab.Identity.Web.ViewModels.TenantAdmin;
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
    [HttpGet("/admin/dashboard", Name = AdminRouteNames.Dashboard)]
    public async Task<IActionResult> Dashboard()
    {
        var result = await _sender.Send(new GetTenantDashboardQuery());
        var model = new TenantAdminDashboard(result.Users, result.Roles, result.Permissions, result.Clients, result.Providers, result.Sessions, result.RecentAuditLogs);

        return View(model);
    }

    [HttpGet("users")]
    [HttpGet("/admin/access-control/users", Name = AdminRouteNames.Users)]
    public async Task<IActionResult> Users(string? q = null, string sort = "email", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantUsersQuery(q, sort, dir));
        var model = new TenantUsersPage(result.Users, result.Roles, result.AssignedRoleIds, q, sort, dir);
        return View(model);
    }

    [HttpPost("users")]
    [HttpPost("/admin/access-control/users")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateUser(CreateTenantUserInput input)
    {
        var result = await _sender.Send(new CreateTenantUserCommand(input.Email, input.DisplayName, input.Password, input.IsTenantAdmin));
        return result.Succeeded ? RedirectToAction(nameof(Users)) : BadRequest(result.Errors);
    }

    [HttpPost("users/{id:guid}/disable")]
    [HttpPost("/admin/access-control/users/{id:guid}/disable")]
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
    [HttpPost("/admin/access-control/users/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditUser(Guid id, EditTenantUserInput input)
    {
        var result = await _sender.Send(new EditTenantUserCommand(id, input.Email, input.DisplayName, input.IsEnabled, input.IsTenantAdmin));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpPost("users/{id:guid}/delete")]
    [HttpPost("/admin/access-control/users/{id:guid}/delete")]
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
    [HttpPost("/admin/access-control/users/{userId:guid}/roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetUserRoles(Guid userId, SetTenantUserRolesInput input)
    {
        var result = await _sender.Send(new SetTenantUserRolesCommand(userId, input.RoleIds.Distinct().ToArray()));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Users));
    }

    [HttpGet("roles")]
    [HttpGet("/admin/access-control/roles", Name = AdminRouteNames.Roles)]
    public async Task<IActionResult> Roles(string? q = null, string sort = "name", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantRolesQuery(q, sort, dir));
        var model = new TenantRolesPage(result.Roles, result.Permissions, result.AssignedPermissionIds, q, sort, dir);
        return View(model);
    }

    [HttpPost("roles")]
    [HttpPost("/admin/access-control/roles")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateRole(CreateTenantRoleInput input)
    {
        var result = await _sender.Send(new CreateTenantRoleCommand(input.Name, input.Description));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/edit")]
    [HttpPost("/admin/access-control/roles/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditRole(Guid id, EditTenantRoleInput input)
    {
        var result = await _sender.Send(new EditTenantRoleCommand(id, input.Name, input.Description));
        if (result.NotFound)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{id:guid}/delete")]
    [HttpPost("/admin/access-control/roles/{id:guid}/delete")]
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
    [HttpPost("/admin/access-control/users/{userId:guid}/roles/{roleId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignRole(Guid userId, Guid roleId)
    {
        await _sender.Send(new AssignTenantRoleCommand(userId, roleId));
        return RedirectToAction(nameof(Users));
    }

    [HttpGet("permissions")]
    [HttpGet("/admin/access-control/permissions", Name = AdminRouteNames.Permissions)]
    public async Task<IActionResult> Permissions(string? q = null, string sort = "category", string dir = "asc")
    {
        var result = await _sender.Send(new GetTenantPermissionsQuery(q, sort, dir));
        return View(new TenantPermissionsPage(result, q, sort, dir));
    }

    [HttpPost("permissions")]
    [HttpPost("/admin/access-control/permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreatePermission(CreateTenantPermissionInput input)
    {
        var result = await _sender.Send(new CreateTenantPermissionCommand(input.Name, input.Category, input.Description));
        if (!result.Succeeded)
        {
            return View("Permissions", new TenantPermissionsPage(await _sender.Send(new GetTenantPermissionsQuery(null, "category", "asc")), null, "category", "asc"));
        }

        return RedirectToAction(nameof(Permissions));
    }

    [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
    [HttpPost("/admin/access-control/roles/{roleId:guid}/permissions/{permissionId:guid}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AssignPermission(Guid roleId, Guid permissionId)
    {
        await _sender.Send(new AssignTenantPermissionCommand(roleId, permissionId));
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("roles/{roleId:guid}/permissions")]
    [HttpPost("/admin/access-control/roles/{roleId:guid}/permissions")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetRolePermissions(Guid roleId, SetTenantRolePermissionsInput input)
    {
        await _sender.Send(new SetTenantRolePermissionsCommand(roleId, input.PermissionIds.Distinct().ToArray()));
        return RedirectToAction(nameof(Roles));
    }

    [HttpPost("permissions/{id:guid}/edit")]
    [HttpPost("/admin/access-control/permissions/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditPermission(Guid id, EditTenantPermissionInput input)
    {
        var result = await _sender.Send(new EditTenantPermissionCommand(id, input.Name, input.Category, input.Description));
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
    [HttpPost("/admin/access-control/permissions/{id:guid}/delete")]
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
    [HttpGet("/admin/applications", Name = AdminRouteNames.Applications)]
    public async Task<IActionResult> Clients() => View(await _sender.Send(new GetTenantClientsQuery()));

    [HttpPost("clients")]
    [HttpPost("/admin/applications")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateClient(CreateTenantClientInput input)
    {
        var result = await _sender.Send(new CreateTenantClientCommand(input.Name, input.ClientId, input.Type, input.RedirectUri, input.Scopes, input.Flows));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        TempData["ClientSecret"] = result.ClientSecret;
        TempData["ClientId"] = result.ClientId;
        return RedirectToAction(nameof(Clients));
    }

    [HttpGet("providers")]
    [HttpGet("/admin/security/providers", Name = AdminRouteNames.Providers)]
    public async Task<IActionResult> Providers() => View(await _sender.Send(new GetTenantProvidersQuery()));

    [HttpPost("providers")]
    [HttpPost("/admin/security/providers")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProvider(CreateTenantProviderInput input)
    {
        var result = await _sender.Send(new CreateTenantProviderCommand(input.DisplayName, input.Authority, input.ClientId, input.ClientSecret, input.Scopes, input.AutoProvisionUsers));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Providers));
    }

    [HttpPost("smtp")]
    [HttpPost("/admin/security/smtp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpsertSmtp(UpsertTenantSmtpInput input)
    {
        var result = await _sender.Send(new UpsertTenantSmtpCommand(input.Host, input.Port, input.Username, input.Password, input.UseTls, input.FromEmail, input.FromDisplayName));
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return RedirectToAction(nameof(Providers));
    }

    [HttpGet("sessions")]
    [HttpGet("/admin/security/sessions", Name = AdminRouteNames.Sessions)]
    public async Task<IActionResult> Sessions() => View(await _sender.Send(new GetTenantSessionsQuery()));

    [HttpPost("sessions/{id:guid}/revoke")]
    [HttpPost("/admin/security/sessions/{id:guid}/revoke")]
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
    [HttpGet("/admin/security/audit", Name = AdminRouteNames.Audit)]
    public async Task<IActionResult> Audit() => View(await _sender.Send(new GetTenantAuditLogsQuery()));
}
