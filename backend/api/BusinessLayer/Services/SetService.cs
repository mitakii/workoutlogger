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
        var set = await _context.UserExerciseSet.FirstOrDefaultAsync(ue => ue.Id == setId);
        if(set == null)
            return Result<UserSetGetResponse>.Failed(ErrorCode.NotFound, "Exercise set not found");

        return Result<UserSetGetResponse>.Success(new()
        {
            ExerciseId = set.ExerciseId,
            SetId = setId,
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
            ExerciseId = exerciseId,
            Reps =  s.Reps,
            Weight = s.Weight,
            SetId = s.Id,
            Order = s.Order
        }).ToList();

        return Result<List<UserSetGetResponse>>.Success(sets);
    }

    public async Task<Result<bool>> CreateUserSetAsync(Guid exerciseId, double weight, int reps)
    {
       
        var exercise = await _context.UserExercises
            .Include(ue=> ue.UserExerciseSets)
            .FirstOrDefaultAsync(e => e.Id == exerciseId);
        
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");

        var set = new UserExerciseSet()
        {
            Weight = weight,
            Reps = reps,
            ExerciseId = exerciseId,
            Order = exercise.UserExerciseSets.Count()
        };
        
        exercise.UserExerciseSets.Add(set);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateUserSetAsync(Guid setId, double weight, int reps)
    {
        var set = await _context.UserExerciseSet.FindAsync(setId);
        if(set == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Set not found");
        
        set.Weight = weight;
        set.Reps = reps;

        _context.UserExerciseSet.Update(set);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<string>> DeleteUserSetAsync(Guid setId)
    {
        var set = await _context.UserExerciseSet.FindAsync(setId);
        if(set == null)
            return Result<string>.Failed(ErrorCode.NotFound, "Set not found");
        _context.UserExerciseSet.Remove(set);
        await _context.SaveChangesAsync();
         return Result<string>.Success("Set has been deleted");
    }
}