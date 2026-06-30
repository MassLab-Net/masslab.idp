using MassLab.Identity.Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MassLab.Identity.Infrastructure.Data;

public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("MASSLAB_IDP_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=masslab_identity;Username=postgres;Password=postgres;SearchPath=masslab_idp";

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(connectionString)
            .UseOpenIddict()
            .Options;

        return new ApplicationDbContext(options, new CurrentTenant());
    }
}
