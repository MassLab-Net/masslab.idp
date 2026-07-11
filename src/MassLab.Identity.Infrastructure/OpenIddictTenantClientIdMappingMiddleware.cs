using System.Text;
using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;

namespace MassLab.Identity.Infrastructure;

public sealed class OpenIddictTenantClientIdMappingMiddleware
{
    private readonly RequestDelegate _next;

    public OpenIddictTenantClientIdMappingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, TenantClientIdFormatter formatter)
    {
        var tenant = TenantRequestContext.GetResolvedTenant(context);
        if (tenant is null || !context.Request.Path.StartsWithSegments("/connect", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        await RewriteClientIdAsync(context, logicalClientId => formatter.FormatPhysicalClientId(tenant.Id, formatter.NormalizeLogicalClientId(logicalClientId)));
        await _next(context);
    }

    private static async Task RewriteClientIdAsync(
        HttpContext context,
        Func<string, string> buildPhysicalClientId)
    {
        if (context.Request.Query.TryGetValue("client_id", out var queryClientId) &&
            !StringValues.IsNullOrEmpty(queryClientId))
        {
            context.Request.QueryString = ReplaceQueryParameter(context.Request.Query, "client_id", buildPhysicalClientId(queryClientId[0]!));
        }

        if (context.Request.HasFormContentType)
        {
            var form = await context.Request.ReadFormAsync(context.RequestAborted);
            if (form.TryGetValue("client_id", out var formClientId) && !StringValues.IsNullOrEmpty(formClientId))
            {
                var values = form.ToDictionary(pair => pair.Key, pair => pair.Value, StringComparer.Ordinal);
                values["client_id"] = buildPhysicalClientId(formClientId[0]!);
                RewriteFormBody(context, values);
            }
        }

        RewriteBasicAuthorizationHeader(context, buildPhysicalClientId);
    }

    private static QueryString ReplaceQueryParameter(IQueryCollection query, string key, string value)
    {
        var builder = new QueryBuilder(query
            .SelectMany(pair => pair.Key.Equals(key, StringComparison.Ordinal)
                ? [new KeyValuePair<string, string>(pair.Key, value)]
                : pair.Value.Select(item => new KeyValuePair<string, string>(pair.Key, item ?? string.Empty))));

        return builder.ToQueryString();
    }

    private static void RewriteBasicAuthorizationHeader(HttpContext context, Func<string, string> buildPhysicalClientId)
    {
        if (!context.Request.Headers.TryGetValue("Authorization", out var authorizationHeader))
        {
            return;
        }

        var header = authorizationHeader.ToString();
        if (!header.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        try
        {
            var raw = Encoding.UTF8.GetString(Convert.FromBase64String(header["Basic ".Length..]));
            var separator = raw.IndexOf(':');
            if (separator < 0)
            {
                return;
            }

            var clientId = raw[..separator];
            var clientSecret = raw[(separator + 1)..];
            var physicalClientId = buildPhysicalClientId(clientId);
            var rewritten = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{physicalClientId}:{clientSecret}"));
            context.Request.Headers.Authorization = $"Basic {rewritten}";
        }
        catch (FormatException)
        {
            // Ignore malformed basic headers and let OpenIddict reject them downstream.
        }
    }

    private static void RewriteFormBody(HttpContext context, Dictionary<string, StringValues> values)
    {
        context.Features.Set<IFormFeature>(new FormFeature(new FormCollection(values)));

        var body = new FormUrlEncodedContent(values
                .SelectMany(pair => pair.Value.Select(value => new KeyValuePair<string, string>(pair.Key, value ?? string.Empty))))
            .ReadAsStringAsync()
            .GetAwaiter()
            .GetResult();

        var bytes = Encoding.UTF8.GetBytes(body);
        context.Request.Body = new MemoryStream(bytes);
        context.Request.ContentLength = bytes.Length;
    }
}
