using BusinessLayer.DTO;
using BusinessLayer.Exceptions;

namespace BusinessLayer.Interfaces;

public interface IUserSetService
{
    public Task<Result<UserSetGetResponse>> GetUserSetAsync(Guid setId);
    public Task<Result<List<UserSetGetResponse>>> GetUserSetsAsync(Guid exerciseId);
    public Task<Result<bool>> CreateUserSetAsync(Guid userId, Guid userExerciseId, double weight, int reps);
    public Task<Result<bool>> UpdateUserSetAsync(Guid userId, Guid setId, double weight, int reps);
    public Task<Result<string>> DeleteUserSetAsync(Guid userId, Guid setId);
}