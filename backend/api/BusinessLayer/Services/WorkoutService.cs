using System.Net;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class WorkoutService : IWorkoutService
{
    private readonly AppDbContext _context;
    private readonly ITranslationRepository _translationRepo;
    private readonly IStatisticsService _statistics;
    private readonly IStatisticsRepository _statisticsRepository;

    public WorkoutService(AppDbContext context,
        ITranslationRepository translationRepository, 
        IStatisticsService statistics, IStatisticsRepository statisticsRepository)
    {
        _context = context;
        _translationRepo = translationRepository;
        _statistics = statistics;
        _statisticsRepository = statisticsRepository;
    }
    
    public async Task<Result<WorkoutResponse>> StartAsync(Guid userId)
    {
        var user  = await _context.Users.FindAsync(userId);
        if (user == null)
            return Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"User not found");
        
        var workout = new Workout
        {
            User =  user,
            DateOnlyCreated = WorkoutDate.GetNormalizedDate(DateTime.UtcNow),
            ExactTimeCreated = DateTime.UtcNow
        };
        
        await _context.Workouts.AddAsync(workout);
        await _context.SaveChangesAsync();

        var exist = await _statistics.DailyStatisticsExistAsync(userId, workout.DateOnlyCreated);

        if (exist.Succeeded)
            await _statisticsRepository.MarkDirty(workout.UserId, workout.DateOnlyCreated);
        else
            await _statistics.CreateDailyStatisticsAsync(userId, workout.DateOnlyCreated);

        return Result<WorkoutResponse>.Success(new WorkoutResponse
        {
            StartTime =  workout.DateOnlyCreated,
            UserId = user.Id,
            WorkoutId = workout.Id,
        });
    }

    public async Task<Result<bool>> DeleteAsync(Guid userId, Guid workoutId)
    {
        var workout = await _context.Workouts.Include(w => w.UserExercises)
            .ThenInclude(ue => ue.UserExerciseSets)
            .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId);
        
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound,"Workout not found");
        
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        
        await _statisticsRepository.MarkDirty(workout.UserId, workout.DateOnlyCreated);
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<WorkoutResponse>> GetByIdAsync(Guid workoutId, string language)
    {
        var workout = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.Id == workoutId)
            .Select(w => new
            {
                w.Id,
                DateStarted = w.DateOnlyCreated,
                w.UserId,
                UserExercises =  w.UserExercises.Select(ue => new
                {
                    ue.Id,
                    ue.RefExerciseId,
                    RefExerciseMediaUrl = ue.RefExercise.MediaUrl,
                    ue.Order,
                    UserExerciseSets = ue.UserExerciseSets.Select(s => new 
                    {
                        s.Id,
                        s.Reps,
                        s.Weight,
                        s.Order
                    }).ToList()
                }).ToList()
            }).FirstOrDefaultAsync();

        if(workout == null)
            return Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"Workout not found");
        
        var exerciseIds = workout.UserExercises
            .Select(ue => ue.RefExerciseId)
            .Distinct()
            .ToList();
        
        var translation =  await _translationRepo
            .GetExerciseTranslationsAsync(exerciseIds, language);
        
        return Result<WorkoutResponse>.Success(new WorkoutResponse
        {
            WorkoutId = workout.Id,
            StartTime = workout.DateStarted,
            UserExercises = workout.UserExercises.Select(e => new UserExerciseGetResponse
            {
                Id = e.Id,
                ExerciseName = translation[e.RefExerciseId].Name,
                ExerciseDescription = translation[e.RefExerciseId].Description,
                ImageUrl = e.RefExerciseMediaUrl,
                Order = e.Order,
                Sets = e.UserExerciseSets.Select(s => new UserExerciseSetResponse
                {
                    Reps = s.Reps,
                    Weight = s.Weight,
                    Order = s.Order,
                    Id = s.Id
                }).OrderBy(s => s.Order).ToList()
            }).OrderByDescending(ue => ue.Order).ToList()
        });
    }

    public async Task<Result<WorkoutResponse>> GetLastWorkoutAsync(Guid userId, string language)
    {
        var lastWorkout = await _context.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.ExactTimeCreated)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if(lastWorkout == null)
            return  Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"Workout not found");

        var result = await GetByIdAsync(lastWorkout.Id, language);
        
        if (!result.Succeeded)
            return Result<WorkoutResponse>.Failed(result.Code, result.ErrorMessages);
        
        return Result<WorkoutResponse>.Success(result.Data);
    }

    public async Task<Result<bool>> 
        AddUserExerciseAsync(Guid userId, Guid workoutId, Guid exerciseId, string language)
    {
        var workout = await _context.Workouts
            .Include(w => w.UserExercises)
            .FirstOrDefaultAsync(w =>  w.Id == workoutId && w.UserId == userId);
        
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound,"Workout not found");

        if( workout.UserExercises
           .Select(ue => ue.RefExerciseId)
           .Contains(exerciseId))
            return Result<bool>.Failed(ErrorCode.BadRequest, "Exercise already exists");

        var exercise = await _context.Exercises.FindAsync(exerciseId);
        if(exercise == null)
            return  Result<bool>.Failed(ErrorCode.NotFound,"Exercise not found");
            
        var userExercise = new UserExercise
        {
            RefExercise = exercise,
            Workout = workout,
            Order = workout.UserExercises.Count(),
        };
        workout.UserExercises.Add(userExercise);

        var newSet = new UserExerciseSet()
        {
            Exercise = userExercise,
            ExerciseId = userExercise.Id,
            Order = 0,
            Reps = 0,
            Weight = 0,
        };
        
        userExercise.UserExerciseSets.Add(newSet);
        await _context.SaveChangesAsync();
        
        var statisticExist = await _statistics.ExerciseStatisticsExistAsync(workout.UserId, exerciseId);
        if(!statisticExist.Succeeded)
            await _statistics.CreateExerciseStatisticsAsync(workout.UserId, exerciseId);
        
        await _statisticsRepository.MarkDirty(workout.UserId, workout.DateOnlyCreated);
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<ICollection<UserExerciseGetResponse>>> 
        GetAllExercisesAsync(Guid workoutId, string language)
    {
        var workout = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.Id == workoutId)
            .Select(w => new
            {
                w.Id,
                UserExercises =  w.UserExercises.Select(ue => new
                {
                    ue.RefExerciseId,
                    RefExerciseMediaUrl = ue.RefExercise.MediaUrl,
                    UserExerciseSets = ue.UserExerciseSets.Select(s => new 
                    {
                        s.Id,
                        s.Reps,
                        s.Weight,
                        s.Order
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefaultAsync();
 
        if(workout == null)
            return Result<ICollection<UserExerciseGetResponse>>.Failed(ErrorCode.NotFound,"Workout not found");

        var exerciseIds = workout.UserExercises
            .Select(ue => ue.RefExerciseId)
            .Distinct()
            .ToList();
        
        var translation =  await _translationRepo
            .GetExerciseTranslationsAsync(exerciseIds, language);
        

        var result = workout.UserExercises.Select(e => new UserExerciseGetResponse
        {
            ExerciseName = translation[e.RefExerciseId].Name,
            ExerciseDescription = translation[e.RefExerciseId].Description,
            ImageUrl = e.RefExerciseMediaUrl,
            Sets = e.UserExerciseSets.Select(s => new UserExerciseSetResponse
            {
                Reps = s.Reps,
                Weight = s.Weight,
                Order = s.Order,
                Id = s.Id
            }).OrderBy(s => s.Order).ToList()
        }).OrderBy(ue => ue.Order).ToList();

        return Result<ICollection<UserExerciseGetResponse>>.Success(result);
    }
    
    public async Task<Result<PagedResult<WorkoutResponse>>> GetAllUserWorkoutsAsync(WorkoutsGetRequest request, string lang = "")
    {
        var workout = await _context.Workouts
            .AsNoTracking()
            .OrderByDescending(w => w.DateOnlyCreated)
            .Where(w => w.User.UserName == request.Username)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(w => new
            {
                w.Id,
                DateStarted = w.DateOnlyCreated,
                w.UserId,
                UserLanguage = w.User.Language,
                UserExercises =  w.UserExercises.Select(ue => new
                {
                    ue.RefExerciseId,
                    ue.Order,
                    RefExerciseMediaUrl = ue.RefExercise.MediaUrl,
                    UserExerciseSets = ue.UserExerciseSets.Select(s => new 
                    {
                        s.Id,
                        s.Reps,
                        s.Weight,
                        s.Order
                    }).ToList()
                }).ToList()
            }).ToListAsync();

        var language = lang == "" ? "en" : lang;
        
        var exerciseIds = workout.SelectMany(w => w.UserExercises)
            .Select(u => u.RefExerciseId)
            .Distinct()
            .ToList();
        
        var translation =  await _translationRepo
            .GetExerciseTranslationsAsync(exerciseIds, language);
        
        var result = workout.Select(w => new WorkoutResponse
        {
            WorkoutId =  w.Id,
            StartTime = w.DateStarted,
            UserExercises = w.UserExercises.Select(e => new UserExerciseGetResponse
            {
                ExerciseName = translation[e.RefExerciseId].Name,
                ExerciseDescription = translation[e.RefExerciseId].Description,
                ImageUrl = e.RefExerciseMediaUrl,
                Order = e.Order,
                Sets = e.UserExerciseSets.Select(s => new UserExerciseSetResponse
                {
                    Reps = s.Reps,
                    Weight = s.Weight,
                    Order = s.Order,
                    Id = s.Id
                }).OrderBy(s => s.Order).ToList()
            }).OrderBy(e => e.Order).ToList(),
        }).OrderByDescending(w => w.StartTime).ToList();
            
        return Result<PagedResult<WorkoutResponse>>.Success(new PagedResult<WorkoutResponse>()
        {
            Items = result,
            PageNumber = request.Page,
            PageSize = request.PageSize,
            TotalItems = result.Count,
        });
    }

    public async Task<Result<bool>> RemoveUserExerciseAsync(Guid userId, Guid exerciseId)
    {
        var exercise = await _context.UserExercises
            .Include(e => e.Workout)
            .FirstOrDefaultAsync(e => e.Id == exerciseId && e.Workout.UserId == userId);

        if (exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        _context.UserExercises.Remove(exercise);
        await _context.SaveChangesAsync();
        
        await _statisticsRepository.MarkDirty(exercise.Workout.UserId, exercise.Workout.DateOnlyCreated);
        
        return Result<bool>.Success(true);
    }
}