using MassLab.Common.Api.Extensions;
using MassLab.Common.Authorization.Extensions;
using MassLab.Common.Logging.Serilog.Extensions;
using MassLab.Common.Observability.Extensions;
using MassLab.Identity.Application;
using MassLab.Identity.Infrastructure;
using MassLab.Identity.Infrastructure.Data;
using Microsoft.AspNetCore.RateLimiting;
using OpenIddict.Abstractions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilogLogging(builder.Configuration);
builder.Services.AddMassLabApi(builder.Configuration);
builder.Services.AddMassLabResponseCompression();
builder.Services.AddMassLabObservability(builder.Configuration);
builder.Services.AddMassLabIdentityApplication();
builder.Services.AddMassLabIdentityInfrastructure(builder.Configuration);

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/account/login";
    options.LogoutPath = "/account/logout";
    options.AccessDeniedPath = "/account/access-denied";
    options.Cookie.Name = "masslab.identity.sso";
    options.Cookie.HttpOnly = true;
    options.SlidingExpiration = true;
});

builder.Services.AddOpenIddict()
    .AddCore(options => options.UseEntityFrameworkCore().UseDbContext<ApplicationDbContext>())
    .AddServer(options =>
    {
        options.SetAuthorizationEndpointUris("/connect/authorize");
        options.SetTokenEndpointUris("/connect/token");
        options.SetRevocationEndpointUris("/connect/revocation");
        options.SetIntrospectionEndpointUris("/connect/introspect");
        options.SetUserInfoEndpointUris("/connect/userinfo");
        options.SetEndSessionEndpointUris("/connect/logout");

        options.AllowAuthorizationCodeFlow().RequireProofKeyForCodeExchange();
        options.AllowClientCredentialsFlow();
        options.AllowRefreshTokenFlow();

        options.RegisterScopes(
            OpenIddictConstants.Scopes.OpenId,
            OpenIddictConstants.Scopes.Profile,
            OpenIddictConstants.Scopes.Email,
            "permissions");

        options.AddDevelopmentEncryptionCertificate();
        options.AddDevelopmentSigningCertificate();

        options.UseAspNetCore()
            .EnableAuthorizationEndpointPassthrough()
            .EnableEndSessionEndpointPassthrough()
            .EnableUserInfoEndpointPassthrough();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    });

builder.Services.AddAuthentication();
builder.Services.AddMassLabAuthorization();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("system-admin", policy => policy.RequireClaim("system_admin", "true"));
    options.AddPolicy("tenant-admin", policy => policy.RequireAssertion(context =>
        context.User.HasClaim("tenant_admin", "true") || context.User.HasClaim("system_admin", "true")));
    foreach (var permission in new[]
             {
                 "tenants.manage", "users.manage", "roles.manage", "permissions.manage", "clients.manage",
                 "providers.manage", "smtp.manage", "sessions.manage", "audit.read"
             })
    {
        options.AddPolicy($"permission:{permission}", policy => policy.RequireClaim("permission", permission));
    }
});

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("login", limiter =>
    {
        limiter.PermitLimit = 20;
        limiter.Window = TimeSpan.FromMinutes(1);
    });
    options.AddFixedWindowLimiter("token", limiter =>
    {
        limiter.PermitLimit = 60;
        limiter.Window = TimeSpan.FromMinutes(1);
    });
});

builder.Services.AddHealthChecks().AddDbContextCheck<ApplicationDbContext>("database");
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = "masslab.identity.session";
    options.Cookie.HttpOnly = true;
    options.IdleTimeout = TimeSpan.FromHours(8);
});
builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseTraceId();
app.UseRequestLogging();
app.UseSecurityHeaders();
app.UseResponseCompression();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();
app.UseRateLimiter();
app.UseMassLabPrometheus();
app.UseSession();
app.UseAuthentication();
app.UseMiddleware<MassLab.Identity.Infrastructure.Multitenancy.TenantResolutionMiddleware>();
app.UseAuthorization();

app.MapHealthChecks("/health");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

if (app.Configuration.GetValue("Database:SeedOnStartup", false))
{
    await DatabaseSeeder.SeedAsync(app.Services);
}

app.Run();

public partial class Program;
