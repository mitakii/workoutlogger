using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IUserService
{
    public Task<Result<bool>> ChangeUserLanguageAsync(Guid userId, string language);
    public Task<Result<UserGetResponse>> GetUserAsync(Guid userId);
    public Task<Result<UserGetResponse>> GetUserByNameAsync(string username);
    public Task<Result<bool>> ChangeUsernameAsync(User user, string newUsername);
    public Task<Result<PagedResult<UserGetResponse>>> GetPagedUsersAsync(string query, int pageIndex, int pageSize);
    public Task<Result<string>> GetUserLanguageAsync(Guid userId);
}