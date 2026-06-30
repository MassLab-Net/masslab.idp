using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Web.Data;
using MassLab.Identity.Web.Domain;
using MassLab.Identity.Web.Multitenancy;
using MassLab.Identity.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MassLab.Identity.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddMassLabIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentTenant, CurrentTenant>();
        services.AddScoped<ICurrentTenantAccessor, CurrentTenantAccessor>();
        services.AddScoped<ISecretService, SecretService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IRbacService, RbacService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ITotpService, TotpService>();

        services.AddScoped<IAccountQueries, AccountApplicationService>();
        services.AddScoped<IAccountCommands, AccountApplicationService>();
        services.AddScoped<ITenantAdminQueries, TenantAdminApplicationService>();
        services.AddScoped<ITenantAdminCommands, TenantAdminApplicationService>();
        services.AddScoped<ISystemAdminQueries, SystemAdminApplicationService>();
        services.AddScoped<ISystemAdminCommands, SystemAdminApplicationService>();
        services.AddScoped<IOpenIdQueries, OpenIdApplicationService>();

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            var connectionString = Environment.GetEnvironmentVariable("MASSLAB_IDP_CONNECTION")
                ?? configuration.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connectionString);
            options.UseOpenIddict();
        });

        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 10;
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimsPrincipalFactory>();

        return services;
    }
}
