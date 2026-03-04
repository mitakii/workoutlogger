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
    
    public async Task<Result<bool>> CreateAsync(Exercise exercise)
    {
        await _dbContext.Exercises.AddAsync(exercise);
        await _dbContext.SaveChangesAsync();
        return Result<bool>.Success(true);
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

    public async Task<Result<PagedResult<ExerciseGetResponse>>> GetAllAsync(string q,string lang, int page, int pageSize)
    {
        if (string.IsNullOrEmpty(q))
            return Result<PagedResult<ExerciseGetResponse>>.Failed(ErrorCode.BadRequest, "Search query is empty");

        var normQ =  q.ToLower();
        
        var query = _dbContext.ExerciseTranslations
            .AsNoTracking()
            .Where(e => e.Language == lang && e.Name.ToLower().Contains(normQ));
        
        var totalItems = await query.CountAsync();

        return Result<PagedResult<ExerciseGetResponse>>.Success(new PagedResult<ExerciseGetResponse>()
        {
            PageNumber = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            Items = await query
                .OrderBy(t => t.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t =>
                    new ExerciseGetResponse
                    {
                        Id = t.ExerciseId,
                        Name = t.Name,
                        Description = t.Description,
                    }).ToListAsync()
        });
    }

    public Task<Result<bool>> UpdateAsync(Exercise exercise)
    {
        throw new NotImplementedException();
    }
}