using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MassLab.Identity.Web.Data;

public sealed class ApplicationDbContext : IdentityDbContext<ApplicationUser, Microsoft.AspNetCore.Identity.IdentityRole<Guid>, Guid>
{
    private readonly ICurrentTenant _currentTenant;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentTenant currentTenant)
        : base(options)
    {
        _currentTenant = currentTenant;
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<TenantDomain> TenantDomains => Set<TenantDomain>();
    public DbSet<TenantDefaultPolicy> TenantDefaultPolicies => Set<TenantDefaultPolicy>();
    public DbSet<TenantRole> TenantRoles => Set<TenantRole>();
    public DbSet<TenantPermission> TenantPermissions => Set<TenantPermission>();
    public DbSet<UserRoleAssignment> UserRoleAssignments => Set<UserRoleAssignment>();
    public DbSet<RolePermissionAssignment> RolePermissionAssignments => Set<RolePermissionAssignment>();
    public DbSet<ClientApplication> ClientApplications => Set<ClientApplication>();
    public DbSet<ClientRedirectUri> ClientRedirectUris => Set<ClientRedirectUri>();
    public DbSet<ExternalLoginProvider> ExternalLoginProviders => Set<ExternalLoginProvider>();
    public DbSet<UserExternalLoginLink> UserExternalLoginLinks => Set<UserExternalLoginLink>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<TenantSmtpSettings> TenantSmtpSettings => Set<TenantSmtpSettings>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.UseOpenIddict();

        builder.Entity<Tenant>(entity =>
        {
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(200);
            entity.Property(x => x.Slug).HasMaxLength(100);
            entity.HasOne(x => x.DefaultPolicy).WithOne(x => x.Tenant).HasForeignKey<TenantDefaultPolicy>(x => x.TenantId);
        });

        builder.Entity<TenantDomain>(entity =>
        {
            entity.HasIndex(x => x.HostName).IsUnique();
            entity.Property(x => x.HostName).HasMaxLength(255);
        });

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.HasIndex(x => new { x.TenantId, x.NormalizedEmail });
            entity.HasIndex(x => new { x.TenantId, x.NormalizedUserName });
            entity.HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        });

        builder.Entity<TenantRole>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<TenantPermission>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<ClientApplication>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<ClientRedirectUri>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<ExternalLoginProvider>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<UserExternalLoginLink>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<UserSession>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<AuditLog>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        builder.Entity<TenantSmtpSettings>().HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);

        builder.Entity<TenantRole>(entity =>
        {
            entity.HasIndex(x => new { x.TenantId, x.Name }).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(150);
        });

        builder.Entity<TenantPermission>(entity =>
        {
            entity.HasIndex(x => new { x.TenantId, x.Name }).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(200);
        });

        builder.Entity<UserRoleAssignment>(entity =>
        {
            entity.HasKey(x => new { x.UserId, x.RoleId });
            entity.HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        });

        builder.Entity<RolePermissionAssignment>(entity =>
        {
            entity.HasKey(x => new { x.RoleId, x.PermissionId });
            entity.HasQueryFilter(x => !_currentTenant.Id.HasValue || x.TenantId == _currentTenant.Id);
        });

        builder.Entity<ClientApplication>(entity =>
        {
            entity.HasIndex(x => new { x.TenantId, x.ClientId }).IsUnique();
            entity.Property(x => x.ClientId).HasMaxLength(200);
        });

        builder.Entity<ClientRedirectUri>()
            .HasOne(x => x.ClientApplication)
            .WithMany(x => x.RedirectUris)
            .HasForeignKey(x => x.ClientApplicationId);
    }

}
