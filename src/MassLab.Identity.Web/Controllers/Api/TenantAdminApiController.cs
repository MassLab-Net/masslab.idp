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
    [Authorize(Policy = "permission:users.manage")]
    public async Task<ActionResult<TenantUsersDto>> GetUsers([FromQuery] string? q = null, [FromQuery] string sort = "email", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantUsersQuery(q, sort, dir)));

    [HttpPost("users")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> CreateUser(CreateTenantUserInput input)
        => ToActionResult(await _sender.Send(new CreateTenantUserCommand(input.Email, input.DisplayName, input.Password, input.IsTenantAdmin)));

    [HttpPost("users/{id:guid}/disable")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> DisableUser(Guid id)
        => ToActionResult(await _sender.Send(new DisableTenantUserCommand(id)));

    [HttpPost("users/{id:guid}/edit")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> EditUser(Guid id, EditTenantUserInput input)
        => ToActionResult(await _sender.Send(new EditTenantUserCommand(id, input.Email, input.DisplayName, input.IsEnabled, input.IsTenantAdmin)));

    [HttpPost("users/{id:guid}/delete")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> DeleteUser(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantUserCommand(id)));

    [HttpPost("users/{userId:guid}/roles")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> SetUserRoles(Guid userId, SetTenantUserRolesInput input)
        => ToActionResult(await _sender.Send(new SetTenantUserRolesCommand(userId, input.RoleIds.Distinct().ToArray())));

    [HttpPost("users/{userId:guid}/access")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> SetUserAccess(Guid userId, SetTenantUserAccessInput input)
        => ToActionResult(await _sender.Send(new SetTenantUserAccessCommand(
            userId,
            input.RoleIds.Distinct().ToArray(),
            input.GrantedPermissionIds.Distinct().ToArray(),
            input.DeniedPermissionIds.Distinct().ToArray())));

    [HttpGet("roles")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<ActionResult<TenantRolesDto>> GetRoles([FromQuery] string? q = null, [FromQuery] string sort = "name", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantRolesQuery(q, sort, dir)));

    [HttpPost("roles")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<IActionResult> CreateRole(CreateTenantRoleInput input)
        => ToActionResult(await _sender.Send(new CreateTenantRoleCommand(input.Name, input.Description)));

    [HttpPost("roles/{id:guid}/edit")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<IActionResult> EditRole(Guid id, EditTenantRoleInput input)
        => ToActionResult(await _sender.Send(new EditTenantRoleCommand(id, input.Name, input.Description)));

    [HttpPost("roles/{id:guid}/delete")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<IActionResult> DeleteRole(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantRoleCommand(id)));

    [HttpPost("users/{userId:guid}/roles/{roleId:guid}")]
    [Authorize(Policy = "permission:users.manage")]
    public async Task<IActionResult> AssignRole(Guid userId, Guid roleId)
        => ToActionResult(await _sender.Send(new AssignTenantRoleCommand(userId, roleId)));

    [HttpGet("permissions")]
    [Authorize(Policy = "permission:permissions.manage")]
    public async Task<ActionResult<IReadOnlyCollection<TenantPermissionDto>>> GetPermissions([FromQuery] string? q = null, [FromQuery] string sort = "category", [FromQuery] string dir = "asc")
        => Ok(await _sender.Send(new GetTenantPermissionsQuery(q, sort, dir)));

    [HttpPost("permissions")]
    [Authorize(Policy = "permission:permissions.manage")]
    public async Task<IActionResult> CreatePermission(CreateTenantPermissionInput input)
        => ToActionResult(await _sender.Send(new CreateTenantPermissionCommand(input.Name, input.Category, input.Description)));

    [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<IActionResult> AssignPermission(Guid roleId, Guid permissionId)
        => ToActionResult(await _sender.Send(new AssignTenantPermissionCommand(roleId, permissionId)));

    [HttpPost("roles/{roleId:guid}/permissions")]
    [Authorize(Policy = "permission:roles.manage")]
    public async Task<IActionResult> SetRolePermissions(Guid roleId, SetTenantRolePermissionsInput input)
        => ToActionResult(await _sender.Send(new SetTenantRolePermissionsCommand(roleId, input.PermissionIds.Distinct().ToArray())));

    [HttpPost("permissions/{id:guid}/edit")]
    [Authorize(Policy = "permission:permissions.manage")]
    public async Task<IActionResult> EditPermission(Guid id, EditTenantPermissionInput input)
        => ToActionResult(await _sender.Send(new EditTenantPermissionCommand(id, input.Name, input.Category, input.Description)));

    [HttpPost("permissions/{id:guid}/delete")]
    [Authorize(Policy = "permission:permissions.manage")]
    public async Task<IActionResult> DeletePermission(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantPermissionCommand(id)));

    [HttpGet("clients")]
    [Authorize(Policy = "permission:clients.manage")]
    public async Task<ActionResult<IReadOnlyCollection<ClientApplicationDto>>> GetClients()
        => Ok(await _sender.Send(new GetTenantClientsQuery()));

    [HttpPost("clients")]
    [Authorize(Policy = "permission:clients.manage")]
    public async Task<IActionResult> CreateClient(CreateTenantClientInput input)
    {
        var result = await _sender.Send(new CreateTenantClientCommand(input.Name, input.ClientId, input.Type, input.RedirectUris, input.PostLogoutRedirectUris, input.Scopes, input.Flows));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPost("clients/{id:guid}/edit")]
    [Authorize(Policy = "permission:clients.manage")]
    public async Task<IActionResult> EditClient(Guid id, EditTenantClientInput input)
        => ToActionResult(await _sender.Send(new EditTenantClientCommand(id, input.Name, input.Type, input.RedirectUris, input.PostLogoutRedirectUris, input.Scopes, input.Flows, input.Enabled)));

    [HttpPost("clients/{id:guid}/delete")]
    [Authorize(Policy = "permission:clients.manage")]
    public async Task<IActionResult> DeleteClient(Guid id)
        => ToActionResult(await _sender.Send(new DeleteTenantClientCommand(id)));

    [HttpGet("providers")]
    [Authorize(Policy = "permission:providers.manage")]
    public async Task<ActionResult<IReadOnlyCollection<ExternalLoginProviderDto>>> GetProviders()
        => Ok(await _sender.Send(new GetTenantProvidersQuery()));

    [HttpPost("providers")]
    [Authorize(Policy = "permission:providers.manage")]
    public async Task<IActionResult> CreateProvider(CreateTenantProviderInput input)
        => ToActionResult(await _sender.Send(new CreateTenantProviderCommand(input.DisplayName, input.Authority, input.ClientId, input.ClientSecret, input.Scopes, input.AutoProvisionUsers)));

    [HttpPost("smtp")]
    [Authorize(Policy = "permission:smtp.manage")]
    public async Task<IActionResult> UpsertSmtp(UpsertTenantSmtpInput input)
        => ToActionResult(await _sender.Send(new UpsertTenantSmtpCommand(input.Provider, input.Host, input.Port, input.Username, input.Password, input.UseTls, input.FromEmail, input.FromDisplayName, input.ResendApiKey, input.SesRegion, input.SesAccessKey, input.SesSecretKey, input.SesConfigurationSetName, input.PasswordResetTemplate, input.EmailVerificationTemplate)));

    [HttpGet("sessions")]
    [Authorize(Policy = "permission:sessions.manage")]
    public async Task<ActionResult<IReadOnlyCollection<UserSessionDto>>> GetSessions()
        => Ok(await _sender.Send(new GetTenantSessionsQuery()));

    [HttpPost("sessions/{id:guid}/revoke")]
    [Authorize(Policy = "permission:sessions.manage")]
    public async Task<IActionResult> RevokeSession(Guid id)
        => ToActionResult(await _sender.Send(new RevokeTenantSessionCommand(id)));

    [HttpGet("audit")]
    [Authorize(Policy = "permission:audit.read")]
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
