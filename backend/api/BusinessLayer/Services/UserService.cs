using ApplicationLayer.Data.Enums;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;

namespace BusinessLayer.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;
    public UserService(UserManager<User> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }
    public async Task<Result<bool>> ChangeUserLanguageAsync(string userId, string language)
    {
        if (string.IsNullOrEmpty(language))
            return Result<bool>.Failed(ErrorCode.BadRequest, "Language in not specified");
        
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User not found");
        
        user.Language = language;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<bool>.Failed(ErrorCode.BadRequest, 
                result.Errors.Select(e => e.Description).ToList());
        
        return Result<bool>.Success(true);
    }
}