using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DataAccessLayer;

public static class DependencyInjection
{
    public static void ConfigureDataAccessServices(this IHostApplicationBuilder builder)
    {
        builder.Services
            .AddIdentityCore<User>(options =>
            {
                // options.Password.RequireUppercase = true;
                // options.Password.RequiredLength = 8;
                // options.Password.RequireDigit = true;

                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();
        
        builder.Services.AddDbContext<AppDbContext>(options  => 
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
        
        builder.Services.AddScoped<ITokenRepository, TokenRepository>();
        builder.Services.AddScoped<ITranslationRepository, TranslationRepository>();
    } 
}