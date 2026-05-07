using System.Text.RegularExpressions;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class ExerciseService : IExerciseService
{
    private readonly AppDbContext _dbContext;

    public ExerciseService(AppDbContext context)
    {
        _dbContext = context;
    }
    
    public async Task<Result<string>> CreateAsync(ExerciseCreateRequest request)
    {
        request.NameTag = Regex.Replace(request.NameTag.Trim().ToLower(), @"\s+", "_");
        
        if(await _dbContext.Exercises.AnyAsync((e) => e.NameTag == request.NameTag))
            return Result<string>.Failed(ErrorCode.BadRequest,
                new Dictionary<string, string>{ [nameof(request.NameTag)] = "NameTag already exists" });

        var exercise = new Exercise
        {
            NameTag = request.NameTag,
            MediaUrl =  request.MediaUrl,
            Description = "",
            Translations = request.Translations
                .Select(t => new ExerciseTranslations
                {
                    Name = t.Name,
                    Description = t.Description,
                    Language = t.Language
                }).ToList(),
        };
        
        await _dbContext.Exercises.AddAsync(exercise);
        await _dbContext.SaveChangesAsync();
        return Result<string>.Success(exercise.Id.ToString());
    }

    public async Task<Result<bool>> DeleteAsync(string exerciseId)
    {
        var exercise = await _dbContext.Exercises.FindAsync(exerciseId);
        if(exercise == null)
            return Result<bool>.Failed(ErrorCode.BadRequest, "Exercise not found");
        
        _dbContext.Exercises.Remove(exercise);
        await _dbContext.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<ExerciseGetResponse>> GetByIdAsync(string exerciseId)
    {
        var exercise = await _dbContext.Exercises.FindAsync(exerciseId);
        if(exercise == null)
            return Result<ExerciseGetResponse>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        return Result<ExerciseGetResponse>.Success(new ExerciseGetResponse
        {
            Id = exercise.Id,
            Name = exercise.NameTag,
            Description = exercise.Description,
        });
    }

    public async Task<Result<ExerciseGetResponse>> GetByNameAsync(string exerciseName, string language)
    {
        if(string.IsNullOrEmpty(exerciseName))
            return Result<ExerciseGetResponse>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        exerciseName = exerciseName.ToLower();
        
        var exercise = await _dbContext.ExerciseTranslations
            .Where(e => e.Language == language && e.Name.ToLower().Contains(exerciseName))
            .AsNoTracking()
            .FirstOrDefaultAsync();
        
        if(exercise == null)
            return Result<ExerciseGetResponse>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        return Result<ExerciseGetResponse>.Success(new ExerciseGetResponse
        {
            Id = exercise.ExerciseId,
            Name = exercise.Name,
            Description = exercise.Description,
        });
    }

    public async Task<Result<PagedResult<ExerciseGetResponse>>> GetAllAsync(
        ExerciseSearchRequest request, string language)
    {
        if (string.IsNullOrEmpty(request.Query))
            return Result<PagedResult<ExerciseGetResponse>>
                .Failed(ErrorCode.BadRequest, "Search query is empty");

        var normQ = request.Query.ToLower();
        
        var query = _dbContext.ExerciseTranslations
            .AsNoTracking()
            .Where(e => e.Language == language && e.Name.ToLower().Contains(normQ));
        
        var totalItems = await query.CountAsync();

        return Result<PagedResult<ExerciseGetResponse>>
            .Success(new PagedResult<ExerciseGetResponse>()
        {
            PageNumber = request.Page,
            PageSize = request.PageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling((double)totalItems / request.PageSize),
            Items = await query
                .OrderBy(t => t.Name)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t =>
                    new ExerciseGetResponse
                    {
                        Id = t.ExerciseId,
                        Name = t.Name,
                        Description = t.Description,
                    }).ToListAsync()
        });
    }

    public async Task<Result<bool>> UpdateAsync(ExerciseUpdateRequest request)
    {
        var exercise = await _dbContext.Exercises.FindAsync(request.Id);
        if (exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");
        
        exercise.Description = string.IsNullOrEmpty(request.Description) ? exercise.Description : request.Description;
        exercise.MediaUrl = string.IsNullOrEmpty(request.MediaUrl) ? exercise.MediaUrl : request.MediaUrl;
        exercise.NameTag = string.IsNullOrEmpty(request.Nametag)  ? exercise.NameTag : request.Nametag;
        _dbContext.Exercises.Update(exercise);
        await _dbContext.SaveChangesAsync();
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> AddTranslationAsync(ExerciseTranslationCreateRequest request)
    {
        if (string.IsNullOrEmpty(request.ExerciseId))
            return Result<bool>.Failed(ErrorCode.BadRequest, "ExerciseId is empty or null");
        
        var exercise = await _dbContext.Exercises.FindAsync(request.ExerciseId);
        if (exercise == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Exercise not found");

        var translation = new ExerciseTranslations
        {
            Language = request.Language,
            Name = request.Name,
            Description = request.Description,
        };
        
        exercise.Translations.Add(translation);
        await _dbContext.SaveChangesAsync();
        return Result<bool>.Success(true);
    }
}