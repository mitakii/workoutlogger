using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccessLayer.Data;

public static class SeedAdmin
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<User>>();

        var user = new User()
        {
            UserName = "test",
            Email = "test@gmail.com",
            Language = "en"
        };

        if (await userManager.FindByNameAsync(user.UserName) == null)
        {
            var result = await userManager.CreateAsync(user, "testQ123_sd");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Admin");
                await userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}