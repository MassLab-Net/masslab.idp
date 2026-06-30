using System.Security.Claims;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Application.Features;

namespace MassLab.Identity.Application.Tests;

public sealed class HandlerTests
{
    [Fact]
    public async Task Login_handler_delegates_to_account_commands()
    {
        var commands = new FakeAccountCommands
        {
            LoginResult = LoginResult.Success()
        };
        var handler = new LoginCommandHandler(commands);

        var result = await handler.Handle(new LoginCommand("demo@masslab.local", "MassLab@12345", true), CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal("demo@masslab.local", commands.LastEmail);
        Assert.Equal("MassLab@12345", commands.LastPassword);
        Assert.True(commands.LastRememberMe);
    }

    [Fact]
    public async Task Dashboard_query_handler_returns_service_payload()
    {
        var expected = new TenantAdminDashboardDto(1, 2, 3, 4, 5, 6, Array.Empty<AdminAuditLogDto>());
        var queries = new FakeTenantAdminQueries
        {
            Dashboard = expected
        };
        var handler = new GetTenantDashboardQueryHandler(queries);

        var result = await handler.Handle(new GetTenantDashboardQuery(), CancellationToken.None);

        Assert.Equal(expected, result);
    }

    private sealed class FakeAccountCommands : IAccountCommands
    {
        public LoginResult LoginResult { get; set; } = LoginResult.Failure("not configured");

        public string? LastEmail { get; private set; }

        public string? LastPassword { get; private set; }

        public bool LastRememberMe { get; private set; }

        public Task<LoginResult> LoginAsync(string email, string password, bool rememberMe, CancellationToken cancellationToken = default)
        {
            LastEmail = email;
            LastPassword = password;
            LastRememberMe = rememberMe;
            return Task.FromResult(LoginResult);
        }

        public Task LogoutAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task RequestPasswordResetAsync(string email, CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task<CommandResult> ResetPasswordAsync(string email, string token, string password, CancellationToken cancellationToken = default)
            => Task.FromResult(CommandResult.Success());

        public Task<CommandResult> VerifyMfaChallengeAsync(ClaimsPrincipal principal, string code, CancellationToken cancellationToken = default)
            => Task.FromResult(CommandResult.Success());

        public Task<VerifyEmailResult> VerifyEmailAsync(string email, string token, CancellationToken cancellationToken = default)
            => Task.FromResult(new VerifyEmailResult(true, true));
    }

    private sealed class FakeTenantAdminQueries : ITenantAdminQueries
    {
        public TenantAdminDashboardDto Dashboard { get; set; } = new(0, 0, 0, 0, 0, 0, Array.Empty<AdminAuditLogDto>());

        public Task<TenantAdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default) => Task.FromResult(Dashboard);

        public Task<TenantUsersDto> GetUsersAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
            => Task.FromResult(new TenantUsersDto(Array.Empty<TenantUserDto>(), Array.Empty<TenantRoleDto>(), new Dictionary<Guid, HashSet<Guid>>()));

        public Task<TenantRolesDto> GetRolesAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
            => Task.FromResult(new TenantRolesDto(Array.Empty<TenantRoleDto>(), Array.Empty<TenantPermissionDto>(), new Dictionary<Guid, HashSet<Guid>>()));

        public Task<IReadOnlyCollection<TenantPermissionDto>> GetPermissionsAsync(string? query, string sort, string direction, CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyCollection<TenantPermissionDto>>(Array.Empty<TenantPermissionDto>());

        public Task<IReadOnlyCollection<ClientApplicationDto>> GetClientsAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyCollection<ClientApplicationDto>>(Array.Empty<ClientApplicationDto>());

        public Task<IReadOnlyCollection<ExternalLoginProviderDto>> GetProvidersAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyCollection<ExternalLoginProviderDto>>(Array.Empty<ExternalLoginProviderDto>());

        public Task<IReadOnlyCollection<UserSessionDto>> GetSessionsAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyCollection<UserSessionDto>>(Array.Empty<UserSessionDto>());

        public Task<IReadOnlyCollection<AdminAuditLogDto>> GetAuditLogsAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyCollection<AdminAuditLogDto>>(Array.Empty<AdminAuditLogDto>());
    }
}
