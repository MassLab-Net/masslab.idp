using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Domain;
using MassLab.Identity.Web.ViewModels.TenantAdmin;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;

namespace MassLab.Identity.Web.Controllers.Api;

[ApiController]
[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme, Policy = "tenant-admin")]
[Route("api/admin/tenant")]
public sealed class TenantAdminApiController : ControllerBase
{
    private readonly ISender _sender;

    public TenantAdminApiController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<TenantAdminDashboardDto>> GetDashboard()
        => Ok(await _sender.Send(new GetTenantDashboardQuery()));

    [HttpGet("users")]
    public async Task<ActionResult<TenantUsersDto>> GetUsers([FromQuery] string? q = null, [FromQuery] string sort = "email", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantUsersQuery(q, sort, dir)));

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser(CreateTenantUserInput input)
        => ToActionResult(await _sender.Send(new CreateTenantUserCommand(input.Email, input.DisplayName, input.Password, input.IsTenantAdmin)));

    [HttpPost("users/{id:guid}/disable")]
    public async Task<IActionResult> DisableUser(Guid id)
        => ToActionResult(await _sender.Send(new DisableTenantUserCommand(id)));

    [HttpPost("users/{id:guid}/edit")]
    public async Task<IActionResult> EditUser(Guid id, EditTenantUserInput input)
        => ToActionResult(await _sender.Send(new EditTenantUserCommand(id, input.Email, input.DisplayName, input.IsEnabled, input.IsTenantAdmin)));

    [HttpPost("users/{id:guid}/delete")]
    public async Task<IActionResult> DeleteUser(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantUserCommand(id)));

    [HttpPost("users/{userId:guid}/roles")]
    public async Task<IActionResult> SetUserRoles(Guid userId, SetTenantUserRolesInput input)
        => ToActionResult(await _sender.Send(new SetTenantUserRolesCommand(userId, input.RoleIds.Distinct().ToArray())));

    [HttpGet("roles")]
    public async Task<ActionResult<TenantRolesDto>> GetRoles([FromQuery] string? q = null, [FromQuery] string sort = "name", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantRolesQuery(q, sort, dir)));

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole(CreateTenantRoleInput input)
        => ToActionResult(await _sender.Send(new CreateTenantRoleCommand(input.Name, input.Description)));

    [HttpPost("roles/{id:guid}/edit")]
    public async Task<IActionResult> EditRole(Guid id, EditTenantRoleInput input)
        => ToActionResult(await _sender.Send(new EditTenantRoleCommand(id, input.Name, input.Description)));

    [HttpPost("roles/{id:guid}/delete")]
    public async Task<IActionResult> DeleteRole(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantRoleCommand(id)));

    [HttpPost("users/{userId:guid}/roles/{roleId:guid}")]
    public async Task<IActionResult> AssignRole(Guid userId, Guid roleId)
        => ToActionResult(await _sender.Send(new AssignTenantRoleCommand(userId, roleId)));

    [HttpGet("permissions")]
    public async Task<ActionResult<IReadOnlyCollection<TenantPermissionDto>>> GetPermissions([FromQuery] string? q = null, [FromQuery] string sort = "category", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantPermissionsQuery(q, sort, dir)));

    [HttpPost("permissions")]
    public async Task<IActionResult> CreatePermission(CreateTenantPermissionInput input)
        => ToActionResult(await _sender.Send(new CreateTenantPermissionCommand(input.Name, input.Category, input.Description)));

    [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
    public async Task<IActionResult> AssignPermission(Guid roleId, Guid permissionId)
        => ToActionResult(await _sender.Send(new AssignTenantPermissionCommand(roleId, permissionId)));

    [HttpPost("roles/{roleId:guid}/permissions")]
    public async Task<IActionResult> SetRolePermissions(Guid roleId, SetTenantRolePermissionsInput input)
        => ToActionResult(await _sender.Send(new SetTenantRolePermissionsCommand(roleId, input.PermissionIds.Distinct().ToArray())));

    [HttpPost("permissions/{id:guid}/edit")]
    public async Task<IActionResult> EditPermission(Guid id, EditTenantPermissionInput input)
        => ToActionResult(await _sender.Send(new EditTenantPermissionCommand(id, input.Name, input.Category, input.Description)));

    [HttpPost("permissions/{id:guid}/delete")]
    public async Task<IActionResult> DeletePermission(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantPermissionCommand(id)));

    [HttpGet("clients")]
    public async Task<ActionResult<IReadOnlyCollection<ClientApplicationDto>>> GetClients()
        => Ok(await _sender.Send(new GetTenantClientsQuery()));

    [HttpPost("clients")]
    public async Task<IActionResult> CreateClient(CreateTenantClientInput input)
    {
        var result = await _sender.Send(new CreateTenantClientCommand(input.Name, input.ClientId, input.Type, input.RedirectUri, input.Scopes, input.Flows));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpGet("providers")]
    public async Task<ActionResult<IReadOnlyCollection<ExternalLoginProviderDto>>> GetProviders()
        => Ok(await _sender.Send(new GetTenantProvidersQuery()));

    [HttpPost("providers")]
    public async Task<IActionResult> CreateProvider(CreateTenantProviderInput input)
        => ToActionResult(await _sender.Send(new CreateTenantProviderCommand(input.DisplayName, input.Authority, input.ClientId, input.ClientSecret, input.Scopes, input.AutoProvisionUsers)));

    [HttpPost("smtp")]
    public async Task<IActionResult> UpsertSmtp(UpsertTenantSmtpInput input)
        => ToActionResult(await _sender.Send(new UpsertTenantSmtpCommand(input.Host, input.Port, input.Username, input.Password, input.UseTls, input.FromEmail, input.FromDisplayName)));

    [HttpGet("sessions")]
    public async Task<ActionResult<IReadOnlyCollection<UserSessionDto>>> GetSessions()
        => Ok(await _sender.Send(new GetTenantSessionsQuery()));

    [HttpPost("sessions/{id:guid}/revoke")]
    public async Task<IActionResult> RevokeSession(Guid id)
        => ToActionResult(await _sender.Send(new RevokeTenantSessionCommand(id)));

    [HttpGet("audit")]
    public async Task<ActionResult<IReadOnlyCollection<AdminAuditLogDto>>> GetAudit()
        => Ok(await _sender.Send(new GetTenantAuditLogsQuery()));

    private ActionResult ToActionResult(CommandResult result)
    {
        if (result.NotFound)
        {
            return NotFound(result);
        }

        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
