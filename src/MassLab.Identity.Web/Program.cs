using MassLab.Common.Api.Extensions;
using MassLab.Common.Authorization.Extensions;
using MassLab.Common.Logging.Serilog.Extensions;
using MassLab.Common.Observability.Extensions;
using MassLab.Identity.Application;
using MassLab.Identity.Infrastructure;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Web.Options;
using Microsoft.AspNetCore.RateLimiting;
using OpenIddict.Abstractions;
using OpenIddict.Server;

var builder = WebApplication.CreateBuilder(args);
var isDevelopment = builder.Environment.IsDevelopment();

builder.Services.AddSerilogLogging(builder.Configuration);
builder.Services.AddMassLabApi(builder.Configuration);
builder.Services.AddMassLabResponseCompression();
builder.Services.AddMassLabObservability(builder.Configuration);
builder.Services.AddMassLabIdentityApplication();
builder.Services.AddMassLabIdentityInfrastructure(builder.Configuration);
builder.Services.Configure<OpenIddictAdminSpaClientOptions>(builder.Configuration.GetSection("OpenIddict:AdminSpaClient"));
var tokenOptions = builder.Configuration.GetSection("OpenIddict:Tokens").Get<OpenIddictTokenOptions>() ?? new OpenIddictTokenOptions();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminSpa", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        if (origins.Length == 0)
        {
            return;
        }

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/account/login";
    options.LogoutPath = "/account/logout";
    options.AccessDeniedPath = "/account/access-denied";
    options.Cookie.Name = "masslab.identity.sso.v2";
    options.Cookie.Path = "/";
    options.Cookie.HttpOnly = true;
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.Redirect(ApplyCurrentTenantPrefix(context.RedirectUri, context.HttpContext));
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.Redirect(ApplyCurrentTenantPrefix(context.RedirectUri, context.HttpContext));
        return Task.CompletedTask;
    };
});
builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Name = "masslab.identity.antiforgery";
    options.Cookie.Path = "/";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
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

        options.AddEventHandler<OpenIddictServerEvents.ValidateAuthorizationRequestContext>(builder =>
            builder.UseScopedHandler<OpenIddictTenantClientGuard>());
        options.AddEventHandler<OpenIddictServerEvents.ValidateTokenRequestContext>(builder =>
            builder.UseScopedHandler<OpenIddictTenantClientGuard>());
        options.AddEventHandler<OpenIddictServerEvents.ValidateIntrospectionRequestContext>(builder =>
            builder.UseScopedHandler<OpenIddictTenantClientGuard>());
        options.AddEventHandler<OpenIddictServerEvents.ValidateRevocationRequestContext>(builder =>
            builder.UseScopedHandler<OpenIddictTenantClientGuard>());

        options.AddDevelopmentEncryptionCertificate();
        options.AddDevelopmentSigningCertificate();
        switch (tokenOptions.AccessTokenFormat)
        {
            case OpenIddictTokenOptions.SignedJwt:
                options.DisableAccessTokenEncryption();
                break;
            case OpenIddictTokenOptions.EncryptedJwt:
                break;
            default:
                throw new InvalidOperationException(
                    $"Unsupported OpenIddict access token format '{tokenOptions.AccessTokenFormat}'. Supported values: '{OpenIddictTokenOptions.SignedJwt}', '{OpenIddictTokenOptions.EncryptedJwt}'.");
        }

        var aspNetCore = options.UseAspNetCore()
            .EnableAuthorizationEndpointPassthrough()
            .EnableEndSessionEndpointPassthrough()
            .EnableUserInfoEndpointPassthrough()
            .EnableStatusCodePagesIntegration();

        if (isDevelopment)
        {
            aspNetCore.DisableTransportSecurityRequirement();
        }
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
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

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

app.UseMiddleware<MassLab.Identity.Infrastructure.Multitenancy.TenantPathBaseMiddleware>();
app.UseStaticFiles();
app.UseMiddleware<MassLab.Identity.Infrastructure.OpenIddictTenantClientIdMappingMiddleware>();
app.UseStatusCodePagesWithReExecute("/account/oidc-error");
app.UseRouting();
app.UseCors("AdminSpa");
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

await OpenIddictAdminSpaClientSeeder.EnsureConfiguredAsync(app.Services);

app.Run();

static string ApplyCurrentTenantPrefix(string redirectUri, HttpContext httpContext)
{
    var prefix = GetTenantPrefix(httpContext);
    if (string.IsNullOrWhiteSpace(prefix))
    {
        return redirectUri;
    }

    if (Uri.TryCreate(redirectUri, UriKind.Absolute, out var absoluteUri))
    {
        if (absoluteUri.AbsolutePath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            return redirectUri;
        }

        var builder = new UriBuilder(absoluteUri)
        {
            Path = $"{prefix}{absoluteUri.AbsolutePath}"
        };

        return builder.Uri.ToString();
    }

    if (redirectUri.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
    {
        return redirectUri;
    }

    return redirectUri.StartsWith("/", StringComparison.Ordinal)
        ? $"{prefix}{redirectUri}"
        : $"{prefix}/{redirectUri}";
}

static string? GetTenantPrefix(HttpContext httpContext)
{
    if (httpContext.Request.PathBase.HasValue)
    {
        return httpContext.Request.PathBase.Value!;
    }

    var tenantSlug = TenantRequestContext.GetRouteTenantSlug(httpContext);
    return string.IsNullOrWhiteSpace(tenantSlug) ? null : $"/{tenantSlug}";
}

public partial class Program;
