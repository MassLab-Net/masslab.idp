using MassLab.Common.Validation.Extensions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace MassLab.Identity.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddMassLabIdentityApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
        services.AddValidation(typeof(DependencyInjection).Assembly);
        return services;
    }
}
