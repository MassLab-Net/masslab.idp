using MassLab.Identity.Application.Abstractions;
using MediatR;

namespace MassLab.Identity.Application.Features;

public sealed record CreateTenantCommand(string Name, string Slug, string HostName) : IRequest;

public sealed class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand>
{
    private readonly ISystemAdminCommands _commands;

    public CreateTenantCommandHandler(ISystemAdminCommands commands)
    {
        _commands = commands;
    }

    public async Task Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        await _commands.CreateTenantAsync(request.Name, request.Slug, request.HostName, cancellationToken);
    }
}
