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

    public async Task<Result<Guid>> CreateTemplateAsync(Guid userId, string name, string description)
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
        return Result<Guid>.Success(template.Id);
    }

    public async Task<Result<bool>> ApplyTemplateAsync(Guid userId, string userLanguage, Guid workoutId, Guid templateWorkoutId)
    {
        var workout = await _context.Workouts
            .FirstOrDefaultAsync(w => w.Id == workoutId &&  w.UserId == userId);
        
        if(workout == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Workout not found");

        var templateSession = await _context.UserTemplates
            .AsNoTracking()
            .Include(w => w.Exercises)
            .FirstOrDefaultAsync(w => w.Id == templateWorkoutId && w.UserId == userId);

        if(templateSession == null)
            return  Result<bool>.Failed(ErrorCode.NotFound, "Template workout not found");
        
        var templateExercises = templateSession.Exercises
            .Select(e => e.Id)
            .ToList();

        foreach (var exerciseId in templateExercises)
        {
            await _workoutService.AddUserExerciseAsync(userId, workout.Id, exerciseId, userLanguage);
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<TemplateGetResponse>> GetTemplateAsync(Guid userId, Guid templateId, string language)
    {
        var template = await _context.UserTemplates
            .Include(t => t.Exercises)
            .FirstOrDefaultAsync(w => w.Id == templateId && w.UserId == userId);
        
        if(template == null)
            return Result<TemplateGetResponse>.Failed(ErrorCode.NotFound, "Template not found");
        
        var exerciseIds = template.Exercises.Select(e => e.Id).ToList();
        var translations = await _translationRepository.GetExerciseTranslationsAsync(exerciseIds, language);

        return Result<TemplateGetResponse>.Success(new TemplateGetResponse()
        {
            Description = template.Description,
            Name = template.Name,
            Exercises = template.Exercises.Select(e => new ExerciseGetResponse()
            {
                Description = translations[e.Id].Description,
                Name = translations[e.Id].Name,
                Id = e.Id,
                ImageUrl = e.MediaUrl
            }).ToList()
        });
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

    public async Task<Result<Guid>> CreateTemplateFromWorkoutAsync
        (Guid userId, Guid workoutId, string name, string description)
    {
        var workout = await _context.Workouts
            .Include(w => w.UserExercises)
            .ThenInclude(ue => ue.RefExercise)
            .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId);

        if(workout == null)
            return Result<Guid>.Failed(ErrorCode.NotFound, "Workout not found");

        var template = new UserTemplate()
        {
            UserId = userId,
            Description = description,
            Name = name,
            NameNormalized = name.ToUpper(),
            Exercises = workout.UserExercises.Select(ue => ue.RefExercise).ToList(),
        };
        
        await _context.UserTemplates.AddAsync(template);
        await  _context.SaveChangesAsync();

        return  Result<Guid>.Success(template.Id);
    }

    public async Task<Result<bool>> AddExerciseAsync(Guid userId, Guid templateId, Guid exerciseId)
    {
        var template = await _context.UserTemplates
            .Include(t => t.Exercises)
            .FirstOrDefaultAsync(w => w.Id == templateId && w.UserId == userId);
        
        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");
        
        if(template.Exercises.Select(e => e.Id).Contains(exerciseId))
            return Result<bool>.Failed(ErrorCode.BadRequest,  "Exercise already exists");
        
        var exercise =  _context.Exercises.FirstOrDefault(w => w.Id == exerciseId);
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        template.Exercises.Add(exercise);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateTemplateAsync(Guid userId, Guid templateId, string name, string description)
    {
        var template = await _context.UserTemplates
            .FirstOrDefaultAsync(w => w.Id == templateId && w.UserId == userId);
        
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

    public async Task<Result<bool>> DeleteExerciseAsync(Guid userId, Guid templateId, Guid exerciseId)
    {
        var template = await _context.UserTemplates
            .Include(e => e.Exercises)
            .FirstOrDefaultAsync(w => w.Id == templateId && w.UserId == userId);

        if(template == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Template not found");
        
        var exercise = template.Exercises.FirstOrDefault(w => w.Id == exerciseId);
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");

        template.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteTemplateAsync(Guid userId, Guid templateId)
    {
        var template = await _context.UserTemplates
            .FirstOrDefaultAsync(w => w.Id == templateId && w.UserId == userId);
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
                    Name =  ut.Name,
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