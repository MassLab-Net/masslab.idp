using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Common;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantCommand(
    string Name,
    string Slug,
    string HostName,
    string RootEmail,
    string RootDisplayName,
    string? RootPassword) : IRequest<CreateTenantResult>;

public sealed class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, CreateTenantResult>
{
    private readonly ISystemAdminCommands _commands;

    public CreateTenantCommandHandler(ISystemAdminCommands commands)
    {
        _commands = commands;
    }

    public Task<CreateTenantResult> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        return _commands.CreateTenantAsync(
            request.Name,
            request.Slug,
            request.HostName,
            request.RootEmail,
            request.RootDisplayName,
            request.RootPassword,
            cancellationToken);
    }
}
