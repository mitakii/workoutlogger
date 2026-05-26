using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class SetService : IUserSetService
{
    public readonly AppDbContext _context;
    
    public SetService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<Result<UserSetGetResponse>> GetUserSetAsync(Guid setId)
    {
        var set = _context.UserExerciseSets.FirstOrDefault(ue => ue.Id == setId);
        if(set == null)
            return Result<UserSetGetResponse>.Failed(ErrorCode.NotFound, "Exercise set not found");

        return Result<UserSetGetResponse>.Success(new()
        {
            ExerciseId = set.ExerciseId.ToString(),
            SetId = setId.ToString(),
            Weight = set.Weight,
            Reps = set.Reps,
            Order = set.Order
        });
    }

    public async Task<Result<List<UserSetGetResponse>>> GetUserSetsAsync(Guid exerciseId)
    {
        var userExercise = await _context.UserExercises
            .Include(ue=> ue.UserExerciseSets)
            .FirstOrDefaultAsync(e => e.Id == exerciseId);
        
        if(userExercise == null)
            return Result<List<UserSetGetResponse>>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        var sets = userExercise.UserExerciseSets.Select(s => new UserSetGetResponse()
        {
            ExerciseId = exerciseId.ToString(),
            Reps =  s.Reps,
            Weight = s.Weight,
            SetId = s.Id.ToString(),
            Order = s.Order
        }).ToList();

        return Result<List<UserSetGetResponse>>.Success(sets);
    }

    public async Task<Result<UserSetGetResponse>> CreateUserSetAsync(Guid exerciseId, double Weight, int Reps)
    {
       
        var exercise = await _context.UserExercises
            .Include(ue=> ue.UserExerciseSets)
            .FirstOrDefaultAsync(e => e.Id == exerciseId);
        
        if(exercise == null)
            return Result<UserSetGetResponse>.Failed(ErrorCode.NotFound, "Exercise not found");

        var set = new UserExerciseSet()
        {
            Weight = Weight,
            Reps = Reps,
            ExerciseId = exerciseId,
            Order = exercise.UserExerciseSets.Count()
        };
        
        exercise.UserExerciseSets.Add(set);
        await _context.SaveChangesAsync();

        return Result<UserSetGetResponse>.Success(new()
        {
            ExerciseId = exerciseId.ToString(),
            Reps = set.Reps,
            Weight = set.Weight,
            SetId = set.Id.ToString(),
            Order = set.Order
        });
    }

    public async Task<Result<UserSetGetResponse>> UpdateUserSetAsync(Guid setId, double Weight, int Reps)
    {
        var set = await _context.UserExerciseSets.FindAsync(setId);
        if(set == null)
            return Result<UserSetGetResponse>.Failed(ErrorCode.NotFound, "Set not found");
        
        set.Weight = Weight;
        set.Reps = Reps;

        _context.UserExerciseSets.Update(set);
        await _context.SaveChangesAsync();
        return Result<UserSetGetResponse>.Success(new()
        {
            SetId = setId.ToString(),
            Weight = set.Weight,
            Reps = set.Reps,
            Order = set.Order,
            ExerciseId = set.ExerciseId.ToString()
        });
    }

    public async Task<Result<string>> DeleteUserSetAsync(Guid setId)
    {
        var set = await _context.UserExerciseSets.FindAsync(setId);
        if(set == null)
            return Result<string>.Failed(ErrorCode.NotFound, "Set not found");
        _context.UserExerciseSets.Remove(set);
        await _context.SaveChangesAsync();
         return Result<string>.Success("Set has been deleted");
    }
}