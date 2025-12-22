using BusinessLayer.Exceptions;
using BusinessLayer.Models;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IUserService
{
    public Task<Result<UserGetResponse>> GetUserByName(string username);
    public Task<Result<string>> RegisterAsync(User user);
}