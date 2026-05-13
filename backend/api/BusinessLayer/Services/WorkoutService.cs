using System.Net;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class WorkoutService : IWorkoutService
{
    public readonly AppDbContext _context;
    public readonly ITranslationRepository _translationRepo;

    public WorkoutService(AppDbContext context, ITranslationRepository translationRepository)
    {
        _context = context;
        _translationRepo = translationRepository;
    }
    
    public async Task<Result<WorkoutResponse>> StartAsync(string userId)
    {
        var user  = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null)
            return Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"User not found");
        
        var workout = new Workout
        {
            User =  user,
            DateStarted = DateTime.UtcNow,
        };
        
        await _context.Workouts.AddAsync(workout);
        await _context.SaveChangesAsync();

        return Result<WorkoutResponse>.Success(new WorkoutResponse
        {
            StartTime =  workout.DateStarted,
            UserId = user.Id.ToString(),
            WorkoutId = workout.Id.ToString(),
            WorkoutName = workout.Name,
            WorkoutNotes = workout.Notes,
        });
    }

    public async Task<Result<bool>> StopAsync(string workoutId)
    {
        var workout = await _context.Workouts.FindAsync(workoutId);
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound,"Workout not found");
        
        workout.DateCompleted = DateTime.Now;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(string workoutId)
    {
        var workout = await _context.Workouts.FindAsync(workoutId);
        if (workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound,"Workout not found");
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<WorkoutResponse>> GetByIdAsync(string workoutId, string language)
    {

        if (!Guid.TryParse(workoutId, out var workoutGuid))
            return Result<WorkoutResponse>.Failed(ErrorCode.BadRequest,"Bad workout Id");
        
        var workout = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.Id == workoutGuid)
            .Select(w => new
            {
                w.Id,
                w.DateCompleted,
                w.DateStarted,
                w.Notes,
                w.UserId,
                w.Name,
                UserExercises =  w.UserExercises.Select(ue => new
                {
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
            WorkoutId = workout.Id.ToString(),
            EndTime = workout.DateCompleted,
            StartTime = workout.DateStarted,
            WorkoutNotes = workout.Notes,
            WorkoutName = workout.Name,
            UserExercises = workout.UserExercises.Select(e => new UserExerciseGetResponse
            {
                ExerciseName = translation[e.RefExerciseId].Name,
                ExerciseDescription = translation[e.RefExerciseId].Description,
                ImageUrl = e.RefExerciseMediaUrl,
                Order = e.Order,
                Sets = e.UserExerciseSets.Select(s => new UserExerciseSetResponse
                {
                    Reps = s.Reps,
                    Weigth = s.Weight,
                    Order = s.Order,
                    Id = s.Id
                }).OrderBy(s => s.Order).ToList()
            }).OrderBy(ue => ue.Order).ToList()
        });
    }

    public async Task<Result<WorkoutResponse>> GetLastWorkoutAsync(string userId, string language)
    {
        if(!Guid.TryParse(userId, out var workoutGuid))
            return Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"Bad workout Id");

        var lastWorkout = await _context.Workouts
            .Where(w => w.UserId == Guid.Parse(userId))
            .OrderByDescending(w => w.DateStarted)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if(lastWorkout == null)
            return  Result<WorkoutResponse>.Failed(ErrorCode.NotFound,"Workout not found");

        var result = await GetByIdAsync(lastWorkout.Id.ToString(), language);
        
        if (!result.Succeeded)
            return Result<WorkoutResponse>.Failed(result.Code, result.ErrorMessages);
        
        return Result<WorkoutResponse>.Success(result.Data);
    }

    public async Task<Result<UserExerciseGetResponse>> AddUserExerciseAsync(string workoutId, string exerciseId, string language)
    {
        var workout = await _context.Workouts
            .Include(w => w.UserExercises)
            .FirstOrDefaultAsync(w =>  w.Id == Guid.Parse(workoutId));
        
        if (workout == null)
            return Result<UserExerciseGetResponse>.Failed(ErrorCode.NotFound,"Workout not found");

        if( workout.UserExercises
           .Select(ue => ue.RefExerciseId)
           .Any(ueid => ueid == Guid.Parse(exerciseId)))
            return Result<UserExerciseGetResponse>.Failed(ErrorCode.BadRequest, "Exercise already exists");

        var exercise = await _context.Exercises.FindAsync(Guid.Parse(exerciseId));
        if(exercise == null)
            return  Result<UserExerciseGetResponse>.Failed(ErrorCode.NotFound,"Exercise not found");
        
        var userExercise = new UserExercise
        {
            RefExercise = exercise,
            Workout = workout,
            Order = workout.UserExercises.Count(),
        };
        
        workout.UserExercises.Add(userExercise);
        
        await _context.SaveChangesAsync();
        var translation = await _translationRepo.GetExerciseTranslationAsync(exercise.Id, language);
        return Result<UserExerciseGetResponse>.Success(new UserExerciseGetResponse
        {
            ExerciseDescription = translation.Description,
            ExerciseName = translation.Name,
            Id = userExercise.Id.ToString(),
            ImageUrl = "",
            Order =  userExercise.Order,
            Sets = new List<UserExerciseSetResponse>()
        });
    }

    public async Task<Result<ICollection<UserExerciseGetResponse>>> GetAllExercisesAsync(string workoutId, string language)
    {
        var workout = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.Id == Guid.Parse(workoutId))
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
                Weigth = s.Weight,
                Order = s.Order,
                Id = s.Id
            }).OrderBy(s => s.Order).ToList()
        }).OrderBy(ue => ue.Order).ToList();

        return Result<ICollection<UserExerciseGetResponse>>.Success(result);
    }
    
    public async Task<Result<PagedResult<WorkoutResponse>>> GetAllUserWorkoutsAsync(WorkoutGetRequest request, string lang = "")
    {
        var workout = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.UserId == Guid.Parse(request.UserId))
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(w => new
            {
                w.Id,
                w.DateCompleted,
                w.DateStarted,
                w.Notes,
                w.UserId,
                w.Name,
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
            WorkoutId =  w.Id.ToString(),
            EndTime = w.DateCompleted,
            StartTime = w.DateStarted,
            WorkoutNotes = w.Notes,
            WorkoutName = w.Name,
            UserExercises = w.UserExercises.Select(e => new UserExerciseGetResponse
            {
                ExerciseName = translation[e.RefExerciseId].Name,
                ExerciseDescription = translation[e.RefExerciseId].Description,
                ImageUrl = e.RefExerciseMediaUrl,
                Order = e.Order,
                Sets = e.UserExerciseSets.Select(s => new UserExerciseSetResponse
                {
                    Reps = s.Reps,
                    Weigth = s.Weight,
                    Order = s.Order,
                    Id = s.Id
                }).OrderBy(s => s.Order).ToList()
            }).OrderBy(e => e.Order).ToList(),
        }).OrderBy(w => w.StartTime).ToList();
            
        return Result<PagedResult<WorkoutResponse>>.Success(new PagedResult<WorkoutResponse>()
        {
            Items = result,
            PageNumber = request.Page,
            PageSize = request.PageSize,
            TotalItems = result.Count,
        });
    }

    public async Task<Result<bool>> RemoveUserExerciseAsync(string exerciseId)
    {
        if(string.IsNullOrEmpty(exerciseId))
            return Result<bool>.Failed(ErrorCode.BadRequest, "ExerciseId is required.");
        
        var exercise = await _context.UserExercises.FindAsync(exerciseId);

        if (exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        _context.UserExercises.Remove(exercise);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public Task<Result<ICollection<UserExercise>>> AddWorkoutFromTemplateAsync(string workoutId)
    {
        throw new NotImplementedException();
    }
}