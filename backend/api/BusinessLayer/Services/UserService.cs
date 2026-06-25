using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
    
    public async Task<Result<bool>> ChangeUserLanguageAsync(Guid userId, string language)
    {
        if (string.IsNullOrEmpty(language))
            return Result<bool>.Failed(ErrorCode.BadRequest, "Language in not specified");
        
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User not found");
        
        user.Language = language;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<bool>.Failed(ErrorCode.BadRequest,
                result.Errors.ToDictionary(error => error.Code, error => error.Description));
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<UserGetResponse>> GetUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
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

    public async Task<Result<bool>> ChangeUsernameAsync(User user, string newUsername)
    {
        user.UserName = newUsername;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<bool>.Failed(ErrorCode.BadRequest, "User not found");
        return Result<bool>.Success(true);
    }

    public async Task<Result<PagedResult<UserGetResponse>>> GetPagedUsersAsync(string query, int pageIndex, int pageSize)
    {
        if (string.IsNullOrEmpty(query))
            return Result<PagedResult<UserGetResponse>>
                .Failed(ErrorCode.BadRequest, "Search query is empty");
        
        var normQ = query.ToUpper();

        var usersQuery = _context.Users
            .AsNoTracking()
            .Where(u => u.NormalizedUserName.Contains(normQ));
        
        var totalItems = await usersQuery.CountAsync();

        return Result<PagedResult<UserGetResponse>>.Success(new PagedResult<UserGetResponse>()
        {
            PageNumber = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
            Items = await usersQuery.OrderBy(t => t.UserName)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(u => MapToResponse(u))
                .ToListAsync()
        });
    }

    public async Task<Result<string>> GetUserLanguageAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return Result<string>.Failed(ErrorCode.NotFound, "User not found");
        
        return Result<string>.Success(user.Language);
    }

    private static UserGetResponse MapToResponse(User user)
    {
        return new UserGetResponse
        {
            Id = user.Id,
            Username = user.UserName,
            Description = user.Description,
            PfpUrl = user.UserPfpUrl
        };
    }
}