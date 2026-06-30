namespace MassLab.Identity.Web.ViewModels.Account;

public sealed record ResetPasswordInput
{
    public string Email { get; init; } = string.Empty;
    public string Token { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
