using MassLab.Common.Api.Extensions;
using MassLab.Common.Authorization.Extensions;
using MassLab.Common.Logging.Serilog.Extensions;
using MassLab.Common.Observability.Extensions;
using MassLab.Identity.Application;
using MassLab.Identity.Infrastructure;
using MassLab.Identity.Infrastructure.Data;
using MassLab.Identity.Infrastructure.Multitenancy;
using MassLab.Identity.Infrastructure.Services;
using MassLab.Identity.Web.Options;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using OpenIddict.Server;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);
var isDevelopment = builder.Environment.IsDevelopment();
var issuer = builder.Configuration["OpenIddict:Issuer"]
    ?? throw new InvalidOperationException("OpenIddict:Issuer must be configured.");
var keyMaterial = builder.Configuration.GetSection("OpenIddict:KeyMaterial").Get<OpenIddictKeyMaterialOptions>() ?? new();
var dataProtection = builder.Configuration.GetSection("Security:DataProtection").Get<IdentityDataProtectionOptions>() ?? new();

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

var dataProtectionBuilder = builder.Services.AddDataProtection()
    .SetApplicationName(dataProtection.ApplicationName);
if (isDevelopment)
{
    dataProtectionBuilder.PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, ".keys")));
}
else
{
    if (string.IsNullOrWhiteSpace(dataProtection.KeyRingPath))
    {
        throw new InvalidOperationException("Security:DataProtection:KeyRingPath must be configured outside Development.");
    }

    dataProtectionBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtection.KeyRingPath));
}

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/account/login";
    options.LogoutPath = "/account/logout";
    options.AccessDeniedPath = "/account/access-denied";
    options.Cookie.Name = "masslab.identity.sso.v2";
    options.Cookie.Path = "/";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
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
    options.Events.OnValidatePrincipal = async context =>
    {
        var sessionId = context.Principal?.FindFirstValue("sid");
        if (!Guid.TryParse(sessionId, out var parsedSessionId))
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return;
        }

        var db = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
        var isActive = await db.UserSessions.IgnoreQueryFilters()
            .AnyAsync(x => x.Id == parsedSessionId && x.RevokedAt == null, context.HttpContext.RequestAborted);
        if (!isActive)
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        }
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

        options.SetIssuer(new Uri(issuer, UriKind.Absolute));
        if (isDevelopment)
        {
            options.AddDevelopmentEncryptionCertificate();
            options.AddDevelopmentSigningCertificate();
        }
        else
        {
            options.AddEncryptionCertificate(LoadCertificate(keyMaterial.EncryptionCertificatePath, keyMaterial.EncryptionCertificatePassword, "encryption"));
            options.AddSigningCertificate(LoadCertificate(keyMaterial.SigningCertificatePath, keyMaterial.SigningCertificatePassword, "signing"));
        }
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

builder.Services.AddAuthentication()
    .AddCookie(MfaAuthenticationDefaults.PendingScheme, options =>
    {
        options.Cookie.Name = "masslab.identity.mfa-pending";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    });
builder.Services.AddMassLabAuthorization();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("system-admin", policy => policy.RequireClaim("system_admin", "true"));
    options.AddPolicy("tenant-admin", policy => policy.RequireClaim("permission"));
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
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
});

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
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<MassLab.Identity.Infrastructure.Multitenancy.TenantResolutionMiddleware>();

app.MapHealthChecks("/health");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

if (app.Configuration.GetValue("Database:ResetAndSeedOnStartup", false))
{
    await DatabaseSeeder.ResetAndSeedAsync(app.Services);
    await OpenIddictAdminSpaClientSeeder.EnsureConfiguredAsync(app.Services);
    return;
}
else if (app.Configuration.GetValue("Database:SeedOnStartup", false))
{
    await DatabaseSeeder.SeedAsync(app.Services);
}

if (app.Configuration.GetValue("OpenIddict:AdminSpaClient:ProvisionOnStartup", false))
{
    await OpenIddictAdminSpaClientSeeder.EnsureConfiguredAsync(app.Services);
}

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

static X509Certificate2 LoadCertificate(string? path, string? password, string purpose)
{
    if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
    {
        throw new InvalidOperationException($"OpenIddict {purpose} certificate path is required and must exist outside Development.");
    }

    return X509CertificateLoader.LoadPkcs12FromFile(
        path,
        password,
        X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.EphemeralKeySet);
}

public partial class Program;
