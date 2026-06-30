using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace MassLab.Identity.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddMassLabIdentityApplication(this IServiceCollection services)
    {
        RegisterValidators(services, typeof(DependencyInjection).Assembly);
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
            cfg.AddOpenBehavior(typeof(Validation.ValidationBehavior<,>));
        });

        return services;
    }

    private static void RegisterValidators(IServiceCollection services, Assembly assembly)
    {
        var validatorInterface = typeof(IValidator<>);
        var registrations = assembly
            .DefinedTypes
            .Where(type => type is { IsAbstract: false, IsInterface: false })
            .Select(type => new
            {
                Implementation = type.AsType(),
                Services = type.ImplementedInterfaces
                    .Where(contract => contract.IsGenericType && contract.GetGenericTypeDefinition() == validatorInterface)
                    .ToArray()
            })
            .Where(entry => entry.Services.Length != 0);

        foreach (var registration in registrations)
        {
            foreach (var serviceType in registration.Services)
            {
                services.AddScoped(serviceType, registration.Implementation);
            }
        }
    }
}
