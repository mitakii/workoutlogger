using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IWorkoutService
{
    public Task<Result<WorkoutResponse>> StartAsync(Guid userId);
    public Task<Result<WorkoutResponse>> GetByIdAsync(Guid workoutId, string language);
    public Task<Result<WorkoutResponse>> GetLastWorkoutAsync(Guid userId, string language);
    public Task<Result<ICollection<UserExerciseGetResponse>>> GetAllExercisesAsync(Guid workoutId, string language);
    public Task<Result<PagedResult<WorkoutResponse>>> GetAllUserWorkoutsAsync(WorkoutsGetRequest request, string lang);
    
    public Task<Result<bool>> AddUserExerciseAsync(Guid userId, Guid workoutId, Guid exerciseId, string language);
    public Task<Result<bool>> DeleteAsync(Guid userId, Guid workoutId);
    public Task<Result<bool>> RemoveUserExerciseAsync(Guid userId, Guid exerciseId);
}