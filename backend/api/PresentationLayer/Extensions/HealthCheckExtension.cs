using CloudinaryDotNet;
using DataAccessLayer.Data;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace PresentationLayer.Extensions;

public static class HealthCheckExtension
{
    public static IServiceCollection AddWLoggerHealthChecks(this IServiceCollection services)
    {
        var check = services.AddHealthChecks()
            .AddDbContextCheck<AppDbContext>("postgres", tags: ["ready"]);
        
        services.PostConfigure<HealthCheckServiceOptions>(options =>
        {
            foreach (var healthCheckRegistration in options.Registrations)
            {
                healthCheckRegistration.Timeout = TimeSpan.FromSeconds(2);
            }
        });
        
        return services;
    }

    public static void MapWLoggerHealthChecks(this WebApplication app)
    {
        app.MapHealthChecks("/health/live", new HealthCheckOptions() {Predicate = _ => false});
        app.MapHealthChecks("/health/ready",
            new HealthCheckOptions() {Predicate = c => c.Tags.Contains("ready")});
    }
}