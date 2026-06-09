namespace MassLab.Identity.Web.Domain;

public sealed class ExternalLoginProvider : TenantEntity
{
    public string DisplayName { get; set; } = string.Empty;
    public string Authority { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string? ClientSecretProtected { get; set; }
    public string Scopes { get; set; } = "openid profile email";
    public bool Enabled { get; set; } = true;
    public string SubjectClaim { get; set; } = "sub";
    public string EmailClaim { get; set; } = "email";
    public string DisplayNameClaim { get; set; } = "name";
    public bool AutoProvisionUsers { get; set; }
}

public sealed class UserExternalLoginLink : TenantEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid ProviderId { get; set; }
    public ExternalLoginProvider? Provider { get; set; }
    public string ProviderSubject { get; set; } = string.Empty;
}

