namespace MassLab.Identity.Web.ViewModels.Account;

public sealed record MfaEnrollViewModel(string Secret, string AuthenticatorUri);
