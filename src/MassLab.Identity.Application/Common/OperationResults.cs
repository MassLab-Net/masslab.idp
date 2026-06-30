namespace MassLab.Identity.Application.Common;

public sealed record CommandResult(bool Succeeded, bool NotFound = false, IReadOnlyCollection<string>? Errors = null)
{
    public static CommandResult Success() => new(true);

    public static CommandResult Missing() => new(false, NotFound: true);

    public static CommandResult Failure(params string[] errors) => new(false, Errors: errors);

    public static CommandResult Failure(IEnumerable<string> errors) => new(false, Errors: errors.ToArray());
}

public sealed record LoginResult(bool Succeeded, string? ErrorMessage = null)
{
    public static LoginResult Success() => new(true);

    public static LoginResult Failure(string message) => new(false, message);
}

public sealed record VerifyEmailResult(bool Found, bool Succeeded);
