using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IWorkoutService
{
    public Task<Result<string>> StartAsync(User user);
    public Task<Result<bool>> StopAsync(string workoutId);
    public Task<Result<bool>> DeleteAsync(string workoutId);
    
    public Task<Result<bool>> AddExerciseAsync(string workoutId, Exercise exercise);
    public Task<Result<bool>> GetAllExercisesAsync(string wokroutId);
    public Task<Result<bool>> RemoveExerciseAsync(Exercise exercise);
    
    public Task<Result<ICollection<UserExercise>>> AddWorkoutFromTemplateAsync(Workout workout);
}