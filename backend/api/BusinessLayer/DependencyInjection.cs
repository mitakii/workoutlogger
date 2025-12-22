using BusinessLayer.Interfaces;
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
    } 
}