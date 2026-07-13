using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class SetService : IUserSetService
{
    private readonly AppDbContext _context;
    private readonly IStatisticsRepository _statisticsRepository;

    public SetService(AppDbContext context, IStatisticsRepository statisticsRepository)
    {
        _context = context;
        _statisticsRepository = statisticsRepository;
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

    public async Task<Result<bool>> CreateUserSetAsync(Guid userExerciseId, double weight, int reps)
    {
        var data = await _context.UserExercises
            .AsNoTracking()
            .Where(ue => ue.Id == userExerciseId)
            .Select(ue => new
            {
                ue.Id,
                ue.UserExerciseSets,
                refExerciseId = ue.RefExerciseId,
                workoutId = ue.Workout.Id,
                date = ue.Workout.DateOnlyCreated,
                userId = ue.Workout.UserId,
            }).FirstOrDefaultAsync();
        
        if(data == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");

        var set = new UserExerciseSet()
        {
            Weight = weight,
            Reps = reps,
            ExerciseId = userExerciseId,
            Order = data.UserExerciseSets.Count
        };
        
        await _context.UserExerciseSet.AddAsync(set);
        await _context.SaveChangesAsync();
        
        await _statisticsRepository.MarkDirty(data.userId, data.date, data.refExerciseId);

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateUserSetAsync(Guid setId, double weight, int reps)
    {
        var set =  await _context.UserExerciseSet
            .Include(s => s.Exercise)
            .ThenInclude(e => e.Workout)
            .FirstOrDefaultAsync(s => s.Id == setId);
        
        if(set == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Set not found");
        
        set.Weight = weight;
        set.Reps = reps;

        _context.UserExerciseSet.Update(set);
        await _context.SaveChangesAsync();

        await _statisticsRepository
            .MarkDirty(set.Exercise.Workout.UserId, set.Exercise.Workout.DateOnlyCreated,
                set.Exercise.RefExerciseId);
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<string>> DeleteUserSetAsync(Guid setId)
    {
        var set =  await _context.UserExerciseSet
            .Include(s => s.Exercise)
            .ThenInclude(e => e.Workout)
            .FirstOrDefaultAsync(s => s.Id == setId);

        if(set == null)
            return Result<string>.Failed(ErrorCode.NotFound, "Set not found");
        
        _context.UserExerciseSet.Remove(set);
        await _context.SaveChangesAsync();
        
        await _statisticsRepository
            .MarkDirty(set.Exercise.Workout.UserId, set.Exercise.Workout.DateOnlyCreated,
                set.Exercise.RefExerciseId);
        
        return Result<string>.Success("Set has been deleted");
    }
}