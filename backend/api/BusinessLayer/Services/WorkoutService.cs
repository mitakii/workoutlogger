using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;

namespace BusinessLayer.Services;

public class WorkoutService : IWorkoutService
{
    public readonly AppDbContext _context;

    public WorkoutService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<Result<string>> StartAsync(User user)
    {
        var workout = new Workout
        {
            User =  user,
            DateStarted = DateTime.Now
        };
        
        await _context.Workouts.AddAsync(workout);
        await _context.SaveChangesAsync();

        return Result<string>.Success(workout.Id.ToString());
    }

    public async Task<Result<bool>> StopAsync(string workoutId)
    {
        var workout = await _context.Workouts.FindAsync(workoutId);
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.BadRequest,"Workout not found");
        
        workout.DateCompleted = DateTime.Now;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(string workoutId)
    {
        var workout = await _context.Workouts.FindAsync(workoutId);
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.BadRequest,"Workout not found");
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> AddExerciseAsync(string workoutId, Exercise exercise)
    {
        var workout = await _context.Workouts.FindAsync(workoutId);
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.BadRequest,"Workout not found");

        var userExercise = new UserExercise
        {
            RefExercise = exercise,
            Workout = workout
        };
        
        workout.UserExercises.Add(userExercise);
        
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public Task<Result<bool>> GetAllExercisesAsync(string wokroutId)
    {
        throw new NotImplementedException();
    }

    public Task<Result<bool>> RemoveExerciseAsync(Exercise exercise)
    {
        throw new NotImplementedException();
    }

    public Task<Result<ICollection<UserExercise>>> AddWorkoutFromTemplateAsync(Workout workout)
    {
        throw new NotImplementedException();
    }
}