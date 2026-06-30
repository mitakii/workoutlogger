using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class WorkoutTemplateService : IWorkoutTemplate
{
    private readonly AppDbContext _context;
    private readonly IWorkoutService _workoutService;
    private readonly ITranslationRepository _translationRepository;


    public WorkoutTemplateService(AppDbContext context, IWorkoutService workoutService, ITranslationRepository translationRepository)
    {
        _context = context;
        _workoutService = workoutService;
        _translationRepository = translationRepository;
    }

    public async Task<Result<bool>> CreateTemplateAsync(Guid userId, string name, string description)
    {
        var template = new UserTemplate()
        {
            UserId = userId,
            Name = name,
            NameNormalized = name.ToUpper(),
            Description = description
        };
        await _context.UserTemplates.AddAsync(template);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> ApplyTemplateAsync(string userLanguage, Guid workoutId, Guid templateWorkoutId)
    {
        var newWorkout = await _context.Workouts.FindAsync(workoutId);
        
        if(newWorkout == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Workout not found");

        var templateSession = await _context.Workouts
            .AsNoTracking()
            .Include(w => w.UserExercises)
            .ThenInclude(ue => ue.RefExerciseId)
            .FirstOrDefaultAsync(w => w.Id == templateWorkoutId);

        if(templateSession == null)
            return  Result<bool>.Failed(ErrorCode.NotFound, "Template workout not found");
        
        var templateExercises = templateSession.UserExercises
            .Select(e => e.RefExerciseId)
            .ToList();

        foreach (var exerciseId in templateExercises)
        {
            await _workoutService.AddUserExerciseAsync(newWorkout.Id, exerciseId, userLanguage);
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<PagedResult<TemplateGetResponse>>> GetUserTemplatesAsync
        (Guid userId, int pageIndex, int pageSize, string language)
    {
        var userTemplates = await _context.UserTemplates
            .AsNoTracking()
            .Include(t => t.Exercises)
            .Where(w => w.UserId == userId).OrderBy(t => t.Name)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize).ToListAsync();
        
        var exerciseIds = userTemplates
            .SelectMany(t => t.Exercises)
            .Select(e => e.Id)
            .ToList();
        
        var translations = await _translationRepository
            .GetExerciseTranslationsAsync(exerciseIds,language);
        
        return Result<PagedResult<TemplateGetResponse>>.Success(new PagedResult<TemplateGetResponse>()
        {
            Items = userTemplates.Select(t => new TemplateGetResponse()
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Exercises = t.Exercises.Select(e => new ExerciseGetResponse()
                {
                    Id = e.Id,
                    Description = translations[e.Id].Description,
                    Name = translations[e.Id].Name,
                    ImageUrl = e.MediaUrl
                }).ToList()
            }).ToList(),
            PageNumber = pageIndex,
            PageSize = pageSize,
        });
    }

    public async Task<Result<bool>> CreateTemplateFromWorkoutAsync
        (Guid userId, Guid workoutId, string name, string description)
    {
        var workout = await _context.Workouts
            .Include(w => w.UserExercises)
            .ThenInclude(ue => ue.RefExercise)
            .FirstOrDefaultAsync(w => w.Id == workoutId);
        
        if(workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Workout not found");

        var template = new UserTemplate()
        {
            UserId = userId,
            Description = description,
            Name = name,
            NameNormalized = name.ToUpper(),
            Exercises = workout.UserExercises.Select(ue => ue.RefExercise).ToList(),
            WorkoutId = workoutId
        };
        
        await _context.UserTemplates.AddAsync(template);
        await  _context.SaveChangesAsync();

        return  Result<bool>.Success(true);
    }

    public async Task<Result<bool>> AddExerciseAsync(Guid templateId, Guid exerciseId)
    {
        var template = await _context.UserTemplates.FirstOrDefaultAsync(w => w.Id == templateId);
        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");
        
        var exercise =  _context.Exercises.FirstOrDefault(w => w.Id == exerciseId);
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        template.Exercises.Add(exercise);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateTemplateAsync(Guid templateId, string name, string description)
    {
        var template = await _context.UserTemplates.FirstOrDefaultAsync(w => w.Id == templateId);
        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");

        if (string.IsNullOrEmpty(name) && template.Name != name)
        {
            template.Name = name;
            template.NameNormalized = name.ToUpper();
        }
        else if(string.IsNullOrEmpty(description) && template.Description != description)
            template.Description = description;
        else return Result<bool>.Success(true);
        
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteExerciseAsync(Guid templateId, Guid exerciseId)
    {
        var template = await _context.UserTemplates
            .FirstOrDefaultAsync(t => t.Id == templateId);
        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");
        
        var exercise = await _context.Exercises.FirstOrDefaultAsync(w => w.Id == exerciseId);
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");

        template.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteTemplateAsync(Guid templateId)
    {
        var template = await _context.UserTemplates.FirstOrDefaultAsync(w => w.Id == templateId);
        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");

        _context.UserTemplates.Remove(template);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<PagedResult<TemplateGetResponse>>> SearchWorkoutTemplateAsync(string query, Guid userId, int pageIndex, int pageSize, string language)
    {
        var normQ = query.ToUpper();
        var templates =  await _context.UserTemplates
            .Include(t => t.Exercises)
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.NameNormalized.Contains(normQ))
            .OrderBy(t => t.Name)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        var exerciseIds = templates
            .SelectMany(t => t.Exercises)
            .Select(e => e.Id)
            .ToList();
        
        var translations = await _translationRepository
            .GetExerciseTranslationsAsync(exerciseIds, language);

        return Result<PagedResult<TemplateGetResponse>>.Success(new PagedResult<TemplateGetResponse>()
        {
            Items = templates
                .Select(ut => new TemplateGetResponse()
                {
                    Id = ut.Id,
                    Description = ut.Description,
                    Exercises = ut.Exercises.Select(e => new ExerciseGetResponse()
                    {
                        Id = e.Id,
                        Description = translations[e.Id].Description,
                        ImageUrl = e.MediaUrl,
                        Name = translations[e.Id].Name
                    }).ToList()

                }).ToList()
            ,
            PageNumber = pageIndex,
            PageSize = pageSize
        });
    }
}