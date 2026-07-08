using System.Text.Json;
using MassLab.Identity.Domain;

namespace MassLab.Identity.Infrastructure;

public sealed class TenantClientIdFormatter
{
    public const string LogicalClientIdPropertyName = "LogicalClientId";

    public string FormatPhysicalClientId(Guid tenantId, string logicalClientId)
    {
        var normalizedClientId = NormalizeLogicalClientId(logicalClientId);
        var prefix = $"{tenantId:N}:";
        return normalizedClientId.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
            ? normalizedClientId
            : $"{prefix}{normalizedClientId}";
    }

    public string NormalizeLogicalClientId(string clientId)
        => clientId.Trim();

    public string GetLogicalClientId(IReadOnlyDictionary<string, JsonElement> properties, string physicalClientId)
    {
        if (properties.TryGetValue(LogicalClientIdPropertyName, out var element) &&
            element.ValueKind == JsonValueKind.String &&
            !string.IsNullOrWhiteSpace(element.GetString()))
        {
            return NormalizeLogicalClientId(element.GetString()!);
        }

        var separatorIndex = physicalClientId.IndexOf(':');
        return separatorIndex >= 0
            ? physicalClientId[(separatorIndex + 1)..]
            : physicalClientId;
    }

    public void SetTenantProperties(
        OpenIddict.Abstractions.OpenIddictApplicationDescriptor descriptor,
        TenantEntity tenantEntity,
        string logicalClientId)
    {
        descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(tenantEntity.TenantId);
        descriptor.Properties[LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(NormalizeLogicalClientId(logicalClientId));
    }

    public void SetTenantProperties(
        OpenIddict.Abstractions.OpenIddictApplicationDescriptor descriptor,
        Guid tenantId,
        string logicalClientId)
    {
        descriptor.Properties[nameof(TenantEntity.TenantId)] = JsonSerializer.SerializeToElement(tenantId);
        descriptor.Properties[LogicalClientIdPropertyName] = JsonSerializer.SerializeToElement(NormalizeLogicalClientId(logicalClientId));
    }
}
