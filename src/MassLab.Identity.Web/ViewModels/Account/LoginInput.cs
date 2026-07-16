namespace MassLab.Identity.Web.ViewModels.Account;

public sealed record LoginInput
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public bool RememberMe { get; init; }
    public string? ReturnUrl { get; init; }
}
