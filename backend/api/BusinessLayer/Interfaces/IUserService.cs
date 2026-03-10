using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IUserService
{
    public Task<Result<bool>> ChangeUserLanguageAsync(string userId, string language);
    public Task<Result<UserGetResponse>> GetUserAsync(string userId);
    public Task<Result<UserGetResponse>> GetUserByNameAsync(string username);
}