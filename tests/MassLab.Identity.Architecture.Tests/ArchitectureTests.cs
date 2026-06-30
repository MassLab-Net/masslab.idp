using System.Reflection;
using MassLab.Identity.Application.Abstractions;
using MassLab.Identity.Application.Features;
using Microsoft.AspNetCore.Mvc;

namespace MassLab.Identity.Architecture.Tests;

public sealed class ArchitectureTests
{
    [Fact]
    public void Application_assembly_does_not_reference_web_assembly()
    {
        var references = typeof(LoginCommand).Assembly.GetReferencedAssemblies().Select(x => x.Name).ToHashSet(StringComparer.Ordinal);

        Assert.DoesNotContain("MassLab.Identity.Web", references);
    }

    [Fact]
    public void Controllers_do_not_depend_on_dbcontext_or_legacy_services()
    {
        var controllers = typeof(Program).Assembly.GetTypes()
            .Where(type => typeof(ControllerBase).IsAssignableFrom(type))
            .Where(type => type.IsClass && !type.IsAbstract)
            .ToArray();

        foreach (var controller in controllers)
        {
            var parameters = controller.GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                .Single()
                .GetParameters()
                .Select(parameter => parameter.ParameterType.FullName ?? parameter.ParameterType.Name)
                .ToArray();

            Assert.DoesNotContain(parameters, name => name.Contains(".Data.", StringComparison.Ordinal));
            Assert.DoesNotContain(parameters, name => name.Contains(".Services.", StringComparison.Ordinal));
            Assert.DoesNotContain(parameters, name => name.Contains(".Infrastructure.", StringComparison.Ordinal));
            Assert.DoesNotContain(parameters, name => name.EndsWith("ApplicationDbContext", StringComparison.Ordinal));
        }
    }

    [Fact]
    public void Application_handlers_do_not_depend_on_infrastructure_or_dbcontext()
    {
        var handlerTypes = typeof(LoginCommand).Assembly.GetTypes()
            .Where(type => type.Name.EndsWith("Handler", StringComparison.Ordinal))
            .Where(type => type.IsClass && !type.IsAbstract);

        foreach (var handler in handlerTypes)
        {
            var constructorParameters = handler.GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                .SelectMany(ctor => ctor.GetParameters())
                .Select(parameter => parameter.ParameterType.FullName ?? parameter.ParameterType.Name);

            Assert.DoesNotContain(constructorParameters, name => name.Contains("MassLab.Identity.Infrastructure", StringComparison.Ordinal));
            Assert.DoesNotContain(constructorParameters, name => name.Contains("MassLab.Identity.Web", StringComparison.Ordinal));
            Assert.DoesNotContain(constructorParameters, name => name.EndsWith("ApplicationDbContext", StringComparison.Ordinal));
        }
    }

    [Fact]
    public void Web_assembly_does_not_define_legacy_infrastructure_namespaces()
    {
        var webTypes = typeof(Program).Assembly.GetTypes()
            .Select(type => type.Namespace)
            .Where(@namespace => !string.IsNullOrWhiteSpace(@namespace))
            .Distinct()
            .ToArray();

        Assert.DoesNotContain(webTypes, @namespace => @namespace!.StartsWith("MassLab.Identity.Web.Data", StringComparison.Ordinal));
        Assert.DoesNotContain(webTypes, @namespace => @namespace!.StartsWith("MassLab.Identity.Web.Services", StringComparison.Ordinal));
        Assert.DoesNotContain(webTypes, @namespace => @namespace!.StartsWith("MassLab.Identity.Web.Multitenancy", StringComparison.Ordinal));
        Assert.DoesNotContain(webTypes, @namespace => @namespace!.StartsWith("MassLab.Identity.Web.Domain", StringComparison.Ordinal));
    }

    [Fact]
    public void Application_dto_contracts_do_not_expose_domain_types()
    {
        var dtoTypes = typeof(MfaEnrollmentDto).Assembly.GetTypes()
            .Where(type => type.Namespace == "MassLab.Identity.Application.Abstractions")
            .Where(type => type.Name.EndsWith("Dto", StringComparison.Ordinal))
            .ToArray();

        foreach (var dtoType in dtoTypes)
        {
            var propertyTypes = dtoType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Select(property => property.PropertyType);

            foreach (var propertyType in propertyTypes)
            {
                Assert.False(ReferencesDomainType(propertyType), $"{dtoType.Name} exposes domain type {propertyType}.");
            }
        }
    }

    private static bool ReferencesDomainType(Type type)
    {
        if ((type.Namespace ?? string.Empty).StartsWith("MassLab.Identity.Domain", StringComparison.Ordinal))
        {
            return true;
        }

        if (type.IsArray)
        {
            return ReferencesDomainType(type.GetElementType()!);
        }

        if (type.IsGenericType)
        {
            return type.GetGenericArguments().Any(ReferencesDomainType);
        }

        return false;
    }
}
