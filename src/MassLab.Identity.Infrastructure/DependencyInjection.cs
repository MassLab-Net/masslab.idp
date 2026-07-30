using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Domain;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MassLab.Common.Email.Extensions;
using MassLab.Common.Email.Resend.Extensions;
using MassLab.Common.Email.Ses.Extensions;
using MassLab.Common.Email.Smtp.Extensions;
using MassLab.Common.Email.Templates.FileSystem.Extensions;

namespace MassLab.Identity.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddMassLabIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddMassLabEmailCore();
        services.AddSmtpEmailProviderFactory();
        services.AddResendEmailProviderFactory();
        services.AddSesEmailProviderFactory();
        services.AddFileSystemEmailTemplates(options => options.RootPath = Path.Combine(AppContext.BaseDirectory, "Templates"));
        services.AddScoped<ICurrentTenant, CurrentTenant>();
        services.AddScoped<ICurrentTenantAccessor, CurrentTenantAccessor>();
        services.AddScoped<ISecretService, SecretService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IRbacService, RbacService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddHostedService<OutboxEmailWorker>();
        services.AddScoped<ITotpService, TotpService>();
        services.AddSingleton<TenantClientIdFormatter>();

        services.AddScoped<IAccountQueries, AccountApplicationService>();
        services.AddScoped<IAccountCommands, AccountApplicationService>();
        services.AddScoped<ITenantAdminQueries, TenantAdminApplicationService>();
        services.AddScoped<ITenantAdminCommands, TenantAdminApplicationService>();
        services.AddScoped<ISystemAdminQueries, SystemAdminApplicationService>();
        services.AddScoped<ISystemAdminCommands, SystemAdminApplicationService>();
        services.AddScoped<IOpenIdQueries, OpenIdApplicationService>();
        services.AddScoped<OpenIddictClientService>();
        services.AddScoped<OpenIddictAdminSpaClientProvisioningService>();

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
