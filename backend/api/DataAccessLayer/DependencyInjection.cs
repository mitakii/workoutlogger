using DataAccessLayer.Data;
using DataAccessLayer.Entities;
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
        builder.Services.AddDbContext<AppDbContext>(options  => 
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
        
        builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                    
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();
    } 
}