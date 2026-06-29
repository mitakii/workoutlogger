using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BusinessLayer.Interfaces;

public interface IWorkoutTemplate
{
    public Task<Result<bool>> CopyWorkoutSessionAsync(string userLanguage, Guid workoutId, Guid templateWorkoutId);
    public Task<Result<PagedResult<TemplateGetResponse>>> SearchWorkoutTemplateAsync(string query, Guid userId,
        int pageIndex,
        int pageSize, string language);
    public Task<Result<PagedResult<TemplateGetResponse>>> GetUserTemplatesAsync(Guid userId, int pageIndex, int pageSize,
        string language);
    public Task<Result<bool>> AddExerciseAsync(Guid templateId, Guid exerciseId);
    public Task<Result<bool>> DeleteExerciseAsync(Guid templateId, Guid exerciseId);
    public Task<Result<bool>> CreateTemplateAsync(Guid userId, string name, string description);
    public Task<Result<bool>> UpdateTemplateAsync(Guid templateId, string name, string description);
    public Task<Result<bool>> DeleteTemplateAsync(Guid templateId);

}