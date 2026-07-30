using MassLab.Identity.Application.Abstractions;
using MediatR;
namespace MassLab.Identity.Application.Features;
public sealed record RequestEmailVerificationCommand(string Email) : IRequest;
public sealed class RequestEmailVerificationCommandHandler(IAccountCommands commands) : IRequestHandler<RequestEmailVerificationCommand>
{ public Task Handle(RequestEmailVerificationCommand request, CancellationToken cancellationToken) => commands.RequestEmailVerificationAsync(request.Email, cancellationToken); }
