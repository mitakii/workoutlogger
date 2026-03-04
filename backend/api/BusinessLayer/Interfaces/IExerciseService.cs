using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IExerciseService
{
    public Task<Result<bool>> CreateAsync(Exercise exercise);
    public Task<Result<bool>> DeleteAsync(string exerciseId);
    
    public Task<Result<ExerciseGetResponse>> GetByIdAsync(string exerciseId);
    public Task<Result<ExerciseGetResponse>> GetByNameAsync(string exerciseName, string language);
    public Task<Result<PagedResult<ExerciseGetResponse>>> GetAllAsync(string q, string lang, int page, int pageSize);
    
    public Task<Result<bool>> UpdateAsync(Exercise exercise);
}