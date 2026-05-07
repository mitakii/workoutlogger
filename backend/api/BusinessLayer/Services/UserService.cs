using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
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
                result.Errors.ToDictionary(error => error.Code, error => error.Description));
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<UserGetResponse>> GetUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result<UserGetResponse>.Failed(ErrorCode.NotFound, "User not found");

        return Result<UserGetResponse>.Success(MapToResponse(user));
    }

    public async Task<Result<UserGetResponse>> GetUserByNameAsync(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if(user == null)
            return Result<UserGetResponse>.Failed(ErrorCode.NotFound, "User not found");

        return Result<UserGetResponse>.Success(MapToResponse(user));
    }

    private UserGetResponse MapToResponse(User user)
    {
        return new UserGetResponse
        {
            Id = user.Id.ToString(),
            Username = user.UserName,
            Descrrpition = user.Description,
            PfpUrl = user.UserPfpUrl
        };
    }
}