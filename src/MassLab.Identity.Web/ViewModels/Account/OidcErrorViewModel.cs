namespace MassLab.Identity.Web.ViewModels.Account;

public sealed class OidcErrorViewModel
{
    public int StatusCode { get; init; }
    public string? Tenant { get; init; }
    public string? Error { get; init; }
    public string? ErrorDescription { get; init; }
    public string? ErrorUri { get; init; }
}
