using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using System.Security.Cryptography;
using System.Text.Json;

namespace MassLab.Identity.Infrastructure;

internal sealed class SystemAdminApplicationService : ISystemAdminQueries, ISystemAdminCommands
{
    private static readonly (string Name, string Category, string Description)[] DefaultPermissions =
    [
        ("tenants.manage", "platform.tenants", "Manage tenant lifecycle and tenant settings"),
        ("users.manage", "access.users", "Manage tenant users"),
        ("roles.manage", "access.roles", "Manage tenant roles"),
        ("permissions.manage", "access.permissions", "Manage tenant permissions"),
        ("clients.manage", "integrations.clients", "Manage client applications"),
        ("providers.manage", "integrations.providers", "Manage external login providers"),
        ("smtp.manage", "settings.notifications.smtp", "Manage SMTP configuration"),
        ("sessions.manage", "security.sessions", "Manage user sessions"),
        ("audit.read", "security.audit", "View audit logs")
    ];

    private readonly ApplicationDbContext _db;
    private readonly OpenIddictAdminSpaClientProvisioningService _adminSpaClientProvisioner;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOpenIddictApplicationManager _applicationManager;

    public SystemAdminApplicationService(
        ApplicationDbContext db,
        OpenIddictAdminSpaClientProvisioningService adminSpaClientProvisioner,
        UserManager<ApplicationUser> userManager,
        IOpenIddictApplicationManager applicationManager)
    {
        _db = db;
        _adminSpaClientProvisioner = adminSpaClientProvisioner;
        _userManager = userManager;
        _applicationManager = applicationManager;
    }

    public async Task<IReadOnlyCollection<SystemTenantDto>> GetTenantsAsync(CancellationToken cancellationToken = default)
        => await _db.Tenants
            .IgnoreQueryFilters()
            .Where(x => x.Status != TenantStatus.Deleted)
            .OrderBy(x => x.Name)
            .Select(x => new SystemTenantDto(
                x.Id,
                x.Name,
                x.Slug,
                x.Status.ToString(),
                x.Status == TenantStatus.Active,
                x.Domains
                    .Where(domain => domain.IsPrimary)
                    .Select(domain => domain.HostName)
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);

    public async Task<CreateTenantResult> CreateTenantAsync(
        string name,
        string slug,
        string hostName,
        string rootEmail,
        string rootDisplayName,
        string? rootPassword,
        CancellationToken cancellationToken = default)
    {
        name = name.Trim();
        slug = slug.Trim().ToLowerInvariant();
        hostName = hostName.Trim().ToLowerInvariant();
        rootEmail = rootEmail.Trim();
        rootDisplayName = rootDisplayName.Trim();
        rootPassword = rootPassword?.Trim();

        if (string.IsNullOrWhiteSpace(name) ||
            string.IsNullOrWhiteSpace(slug) ||
            string.IsNullOrWhiteSpace(hostName) ||
            string.IsNullOrWhiteSpace(rootEmail) ||
            string.IsNullOrWhiteSpace(rootDisplayName))
        {
            return CreateTenantResult.Failure("Tenant name, slug, host name, root email, and root display name are required.");
        }

        if (await _db.Tenants.IgnoreQueryFilters().AnyAsync(x => x.Slug == slug && x.Status != TenantStatus.Deleted, cancellationToken))
        {
            return CreateTenantResult.Failure("Tenant slug already exists.");
        }

        if (await _db.TenantDomains.IgnoreQueryFilters()
            .Join(
                _db.Tenants.IgnoreQueryFilters(),
                domain => domain.TenantId,
                tenant => tenant.Id,
                (domain, tenant) => new { domain.HostName, tenant.Status })
            .AnyAsync(x => x.HostName == hostName && x.Status != TenantStatus.Deleted, cancellationToken))
        {
            return CreateTenantResult.Failure("Tenant host name already exists.");
        }

        if (await _db.Users.IgnoreQueryFilters()
            .Join(
                _db.Tenants.IgnoreQueryFilters(),
                user => user.TenantId,
                tenant => tenant.Id,
                (user, tenant) => new { user.Email, tenant.Status })
            .AnyAsync(x => x.Email == rootEmail && x.Status != TenantStatus.Deleted, cancellationToken))
        {
            return CreateTenantResult.Failure("Root account email already exists.");
        }

        var passwordGenerated = string.IsNullOrWhiteSpace(rootPassword);
        rootPassword = passwordGenerated ? GeneratePassword() : rootPassword;
        var effectiveRootPassword = rootPassword!;

        var tenant = new Tenant { Name = name, Slug = slug, Status = TenantStatus.Active };
        _db.Tenants.Add(tenant);
        _db.TenantDomains.Add(new TenantDomain { TenantId = tenant.Id, HostName = hostName, IsPrimary = true });
        _db.TenantDefaultPolicies.Add(new TenantDefaultPolicy { TenantId = tenant.Id });
        await _db.SaveChangesAsync(cancellationToken);

        await EnsureDefaultPermissionsAsync(tenant.Id, cancellationToken);
        var adminRole = await EnsureTenantAdminRoleAsync(tenant.Id, cancellationToken);

        var rootUser = new ApplicationUser
        {
            TenantId = tenant.Id,
            UserName = rootEmail,
            Email = rootEmail,
            EmailConfirmed = true,
            DisplayName = rootDisplayName,
            IsSystemAdmin = false,
            IsTenantAdmin = true,
            IsEnabled = true
        };

        var createRootResult = await _userManager.CreateAsync(rootUser, effectiveRootPassword);
        if (!createRootResult.Succeeded)
        {
            _db.TenantDefaultPolicies.RemoveRange(_db.TenantDefaultPolicies.Where(x => x.TenantId == tenant.Id));
            _db.RolePermissionAssignments.RemoveRange(_db.RolePermissionAssignments.Where(x => x.TenantId == tenant.Id));
            _db.UserRoleAssignments.RemoveRange(_db.UserRoleAssignments.Where(x => x.TenantId == tenant.Id));
            _db.TenantRoles.RemoveRange(_db.TenantRoles.Where(x => x.TenantId == tenant.Id));
            _db.TenantPermissions.RemoveRange(_db.TenantPermissions.Where(x => x.TenantId == tenant.Id));
            _db.TenantDomains.RemoveRange(_db.TenantDomains.Where(x => x.TenantId == tenant.Id));
            _db.Tenants.Remove(tenant);
            await _db.SaveChangesAsync(cancellationToken);
            return CreateTenantResult.Failure(createRootResult.Errors.Select(error => error.Description));
        }

        _db.UserRoleAssignments.Add(new UserRoleAssignment
        {
            TenantId = tenant.Id,
            UserId = rootUser.Id,
            RoleId = adminRole.Id
        });
        await _db.SaveChangesAsync(cancellationToken);

        await _adminSpaClientProvisioner.EnsureConfiguredAsync(tenant, cancellationToken);
        return CreateTenantResult.Success(rootEmail, effectiveRootPassword, passwordGenerated);
    }

    public async Task<CommandResult> ToggleTenantAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var tenant = await _db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (tenant is null)
        {
            return CommandResult.Missing();
        }

        if (tenant.Status == TenantStatus.Deleted)
        {
            return CommandResult.Failure("Deleted tenants cannot be reactivated. Restore flow is not implemented.");
        }

        tenant.Status = tenant.Status == TenantStatus.Active ? TenantStatus.Disabled : TenantStatus.Active;
        tenant.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        return CommandResult.Success();
    }

    public async Task<CommandResult> DeleteTenantAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var tenant = await _db.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (tenant is null)
        {
            return CommandResult.Missing();
        }

        if (tenant.Status == TenantStatus.Deleted)
        {
            return CommandResult.Failure("Tenant is already deleted.");
        }

        var activeSessionCount = await _db.UserSessions.IgnoreQueryFilters()
            .CountAsync(x => x.TenantId == id && x.RevokedAt == null, cancellationToken);
        if (activeSessionCount > 0)
        {
            return CommandResult.Failure("Tenant still has active sessions. Revoke active sessions before deleting.");
        }

        tenant.Status = TenantStatus.Deleted;
        tenant.UpdatedAt = DateTimeOffset.UtcNow;
        tenant.Slug = BuildArchivedValue(tenant.Slug, tenant.Id, "deleted", 100);

        var users = await _db.Users.IgnoreQueryFilters().Where(x => x.TenantId == id).ToListAsync(cancellationToken);
        foreach (var user in users)
        {
            user.IsEnabled = false;
            user.EmailConfirmed = false;
            user.Email = BuildArchivedEmail(user.Email, user.Id);
            user.UserName = BuildArchivedUserName(user.UserName, user.Id);
            user.NormalizedEmail = _userManager.NormalizeEmail(user.Email);
            user.NormalizedUserName = _userManager.NormalizeName(user.UserName);
        }

        foreach (var domain in await _db.TenantDomains.IgnoreQueryFilters().Where(x => x.TenantId == id).ToListAsync(cancellationToken))
        {
            domain.HostName = BuildArchivedValue(domain.HostName, domain.Id, "deleted-host", 255);
            domain.IsPrimary = false;
        }

        foreach (var provider in await _db.ExternalLoginProviders.IgnoreQueryFilters().Where(x => x.TenantId == id).ToListAsync(cancellationToken))
        {
            provider.Enabled = false;
            provider.UpdatedAt = DateTimeOffset.UtcNow;
        }

        foreach (var session in await _db.UserSessions.IgnoreQueryFilters().Where(x => x.TenantId == id && x.RevokedAt == null).ToListAsync(cancellationToken))
        {
            session.RevokedAt = DateTimeOffset.UtcNow;
            session.UpdatedAt = DateTimeOffset.UtcNow;
        }

        await SetOpenIddictApplicationsEnabledAsync(id, enabled: false, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        return CommandResult.Success();
    }

    private async Task EnsureDefaultPermissionsAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        foreach (var definition in DefaultPermissions)
        {
            if (await _db.TenantPermissions.IgnoreQueryFilters().AnyAsync(
                    x => x.TenantId == tenantId && x.Name == definition.Name,
                    cancellationToken))
            {
                continue;
            }

            _db.TenantPermissions.Add(new TenantPermission
            {
                TenantId = tenantId,
                Name = definition.Name,
                Category = definition.Category,
                Description = definition.Description
            });
        }

        await _db.SaveChangesAsync(cancellationToken);
    }

    private async Task<TenantRole> EnsureTenantAdminRoleAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        var adminRole = await _db.TenantRoles.IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Name == "TenantAdmin", cancellationToken);

        if (adminRole is null)
        {
            adminRole = new TenantRole
            {
                TenantId = tenantId,
                Name = "TenantAdmin",
                Description = "Tenant administrator"
            };
            _db.TenantRoles.Add(adminRole);
            await _db.SaveChangesAsync(cancellationToken);
        }

        var permissionIds = await _db.TenantPermissions.IgnoreQueryFilters()
            .Where(x => x.TenantId == tenantId)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var existingAssignments = await _db.RolePermissionAssignments.IgnoreQueryFilters()
            .Where(x => x.TenantId == tenantId && x.RoleId == adminRole.Id)
            .Select(x => x.PermissionId)
            .ToListAsync(cancellationToken);

        foreach (var permissionId in permissionIds.Except(existingAssignments))
        {
            _db.RolePermissionAssignments.Add(new RolePermissionAssignment
            {
                TenantId = tenantId,
                RoleId = adminRole.Id,
                PermissionId = permissionId
            });
        }

        await _db.SaveChangesAsync(cancellationToken);
        return adminRole;
    }

    private static string GeneratePassword()
    {
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$?_-";
        Span<byte> bytes = stackalloc byte[18];
        RandomNumberGenerator.Fill(bytes);
        var chars = bytes.ToArray().Select(value => alphabet[value % alphabet.Length]).ToArray();
        return new string(chars);
    }

    private static string BuildArchivedEmail(string? currentEmail, Guid userId)
    {
        var localPart = string.IsNullOrWhiteSpace(currentEmail)
            ? "deleted-user"
            : currentEmail.Split('@', 2)[0];
        localPart = localPart.Replace(" ", string.Empty, StringComparison.Ordinal);
        return $"{Truncate(localPart, 180)}+deleted-{userId:N}@deleted.local";
    }

    private static string BuildArchivedUserName(string? currentUserName, Guid userId)
    {
        var value = string.IsNullOrWhiteSpace(currentUserName) ? "deleted-user" : currentUserName;
        return BuildArchivedValue(value, userId, "deleted-user", 256);
    }

    private static string BuildArchivedValue(string? value, Guid id, string label, int maxLength)
    {
        var baseValue = string.IsNullOrWhiteSpace(value) ? label : value.Trim();
        var suffix = $"--{label}-{id:N}";
        var allowedBaseLength = Math.Max(1, maxLength - suffix.Length);
        return $"{Truncate(baseValue, allowedBaseLength)}{suffix}";
    }

    private static string Truncate(string value, int maxLength)
        => value.Length <= maxLength ? value : value[..maxLength];

    private async Task SetOpenIddictApplicationsEnabledAsync(Guid tenantId, bool enabled, CancellationToken cancellationToken)
    {
        var matches = new List<object>();
        await foreach (var application in _applicationManager.ListAsync(cancellationToken: cancellationToken))
        {
            var properties = await _applicationManager.GetPropertiesAsync(application, cancellationToken);
            if (properties.TryGetValue(nameof(TenantEntity.TenantId), out var element) &&
                element.ValueKind == JsonValueKind.String &&
                Guid.TryParse(element.GetString(), out var applicationTenantId) &&
                applicationTenantId == tenantId)
            {
                matches.Add(application);
            }
        }

        foreach (var application in matches)
        {
            var descriptor = new OpenIddictApplicationDescriptor();
            await _applicationManager.PopulateAsync(descriptor, application, cancellationToken);
            descriptor.Properties["Enabled"] = JsonSerializer.SerializeToElement(enabled);
            await _applicationManager.UpdateAsync(application, descriptor, cancellationToken);
        }
    }
}
