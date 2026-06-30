using System.Reflection;
using MassLab.Identity.Application.Features;
using MassLab.Identity.Web.Controllers;

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
        var controllers = new[]
        {
            typeof(AccountController),
            typeof(ConnectController),
            typeof(SystemAdminController),
            typeof(TenantAdminController)
        };

        foreach (var controller in controllers)
        {
            var parameters = controller.GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                .Single()
                .GetParameters()
                .Select(parameter => parameter.ParameterType.FullName ?? parameter.ParameterType.Name)
                .ToArray();

            Assert.DoesNotContain(parameters, name => name.Contains(".Data.", StringComparison.Ordinal));
            Assert.DoesNotContain(parameters, name => name.Contains(".Services.", StringComparison.Ordinal));
            Assert.DoesNotContain(parameters, name => name.EndsWith("ApplicationDbContext", StringComparison.Ordinal));
        }
    }

    [Fact]
    public void Application_handlers_do_not_depend_on_dbcontext()
    {
        var handlerTypes = typeof(LoginCommand).Assembly.GetTypes()
            .Where(type => type.Name.EndsWith("Handler", StringComparison.Ordinal))
            .Where(type => type.IsClass && !type.IsAbstract);

        foreach (var handler in handlerTypes)
        {
            var constructorParameters = handler.GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                .SelectMany(ctor => ctor.GetParameters())
                .Select(parameter => parameter.ParameterType.FullName ?? parameter.ParameterType.Name);

            Assert.DoesNotContain(constructorParameters, name => name.EndsWith("ApplicationDbContext", StringComparison.Ordinal));
        }
    }
}
