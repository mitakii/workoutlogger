using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BusinessLayer.Interfaces;

public interface IWorkoutTemplate
{
    public Task<Result<bool>> ApplyTemplateAsync(Guid userId, string userLanguage, Guid workoutId, Guid templateWorkoutId);
    public Task<Result<TemplateGetResponse>> GetTemplateAsync(Guid userId, Guid templateId, string language);
    public Task<Result<PagedResult<TemplateGetResponse>>> SearchWorkoutTemplateAsync(string query, Guid userId,
        int pageIndex,
        int pageSize, string language);
    public Task<Result<PagedResult<TemplateGetResponse>>> GetUserTemplatesAsync(Guid userId, int pageIndex, int pageSize,
        string language);
    
    public Task<Result<Guid>> CreateTemplateFromWorkoutAsync
        (Guid userId, Guid workoutId, string name, string description);
    public Task<Result<Guid>> CreateTemplateAsync(Guid userId, string name, string description);
    public Task<Result<bool>> AddExerciseAsync(Guid userId, Guid templateId, Guid exerciseId);
    public Task<Result<bool>> DeleteExerciseAsync(Guid userId, Guid templateId, Guid exerciseId);
    public Task<Result<bool>> UpdateTemplateAsync(Guid userId, Guid templateId, string name, string description);
    public Task<Result<bool>> DeleteTemplateAsync(Guid userId, Guid templateId);

}