using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IUserExerciseService
{
    public Task<Result<bool>> CreateExercise(UserExerciseCreateRequest request);
    public Task<Result<bool>> DeleteExercise(string exerciseId);
    
    public Task<Result<string>> GetExerciseById(string exerciseId);
    
    public Task<Result<string>> UpdateExercise(Exercise exercise);
}