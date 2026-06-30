namespace MassLab.Identity.Web.ViewModels.Account;

public sealed record ForgotPasswordInput
{
    public string Email { get; init; } = string.Empty;
}
