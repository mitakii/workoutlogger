using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IWorkoutService
{
    public Task<Result<string>> StartAsync(string userId);
    public Task<Result<bool>> StopAsync(string workoutId);
    public Task<Result<bool>> DeleteAsync(string workoutId);
    public Task<Result<WorkoutResponse>> GetByIdAsync(string workoutId, string language);
    
    public Task<Result<bool>> AddUserExerciseAsync(string workoutId, string exerciseId);
    public Task<Result<ICollection<UserExerciseGetResponse>>> GetAllExercisesAsync(string workoutId, string language);
    public Task<Result<PagedResult<WorkoutResponse>>> GetAllUserWorkoutsAsync(WorkoutGetRequest request, string lang);
    public Task<Result<bool>> RemoveUserExerciseAsync(string exerciseId);
    
    public Task<Result<ICollection<UserExercise>>> AddWorkoutFromTemplateAsync(string workoutId);
}