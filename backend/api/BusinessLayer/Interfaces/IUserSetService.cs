using BusinessLayer.DTO;
using BusinessLayer.Exceptions;

namespace BusinessLayer.Interfaces;

public interface IUserSetService
{
    public Task<Result<UserSetGetResponse>> GetUserSetAsync(Guid setId);
    public Task<Result<List<UserSetGetResponse>>> GetUserSetsAsync(Guid exerciseId);
    public Task<Result<UserSetGetResponse>> CreateUserSetAsync(Guid exerciseId, double Weight, int Reps);
    public Task<Result<UserSetGetResponse>> UpdateUserSetAsync(Guid setId, double Weight, int Reps);
    public Task<Result<string>> DeleteUserSetAsync(Guid setId);
}