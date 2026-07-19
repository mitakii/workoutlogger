using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using BusinessLayer.Security;
using BusinessLayer.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BusinessLayer;

public static class DependencyInjection
{
    public static void ConfigureBusinessServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IExerciseService, ExerciseService>();
        builder.Services.AddScoped<IWorkoutService, WorkoutService>();
        builder.Services.AddScoped<IUserSetService, SetService>();
        builder.Services.AddScoped<IWorkoutTemplate, WorkoutTemplateService>();
        builder.Services.AddScoped<IStatisticsService, StatisticsService>();
        builder.Services.AddScoped<IBackgroundJobService, HangfireJobService>();
        
        builder.Services.Configure<CloudinarySettings>(
            builder.Configuration.GetSection("CloudinarySettings"));
        builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
        
        builder.Services.Configure<JwtOptions>(
            builder.Configuration.GetSection("JWTOptions"));
    } 
}