using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IExerciseService
{
    public Task<Result<string>> CreateAsync(ExerciseCreateRequest exercise);
    public Task<Result<bool>> DeleteAsync(string exerciseId);
    
    public Task<Result<ExerciseGetResponse>> GetByIdAsync(string exerciseId);
    public Task<Result<ExerciseGetResponse>> GetByNameAsync(string exerciseName, string language);
    public Task<Result<PagedResult<ExerciseGetResponse>>> GetAllAsync(ExerciseSearchRequest request, string language);
    
    public Task<Result<bool>> UpdateAsync(ExerciseUpdateRequest request);
    public Task<Result<bool>> AddTranslationAsync(ExerciseTranslationCreateRequest request);
}