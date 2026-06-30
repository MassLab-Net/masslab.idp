namespace MassLab.Identity.Domain;

public sealed class ClientApplication : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string? SecretHash { get; set; }
    public ClientType Type { get; set; } = ClientType.Web;
    public bool Enabled { get; set; } = true;
    public bool RefreshTokensEnabled { get; set; } = true;
    public int? AccessTokenLifetimeMinutes { get; set; }
    public int? RefreshTokenLifetimeDays { get; set; }
    public string AllowedFlows { get; set; } = "authorization_code,refresh_token";
    public string AllowedScopes { get; set; } = "openid,profile,email";
    public ICollection<ClientRedirectUri> RedirectUris { get; set; } = new List<ClientRedirectUri>();
}

public sealed class ClientRedirectUri : TenantEntity
{
    public Guid ClientApplicationId { get; set; }
    public ClientApplication? ClientApplication { get; set; }
    public string Uri { get; set; } = string.Empty;
    public bool IsPostLogout { get; set; }
}
