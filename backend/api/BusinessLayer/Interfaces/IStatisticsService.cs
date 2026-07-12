using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IStatisticsService
{
    public Task<Result<bool>> RecalculateStreak(Guid userId);
    public Task ProcessDirtyStatistics();
    
    public Task<Result<GetUserStatisticResponse>> GetUserStatisticsAsync(Guid userId);
    public Task<Result<bool>> CreateStatisticsAsync(Guid userId);
    public Task<Result<bool>> DeleteStatisticsAsync(Guid userId);
    public Task<Result<bool>> RecalculateUserStatisticsAsync(Guid userId);
    
    public Task<Result<List<DailyStatisticsGetResponse>>> GetDailyStatisticsRangeAsync(Guid userId, DateOnly start, DateOnly end);
    public Task<Result<DailyStatisticsGetResponse>> GetDailyStatisticsAsync(Guid userId, DateOnly date);
    public Task<Result<bool>> CreateDailyStatisticsAsync(Guid userId, DateOnly date);
    public Task<Result<bool>> DeleteDailyStatisticsAsync(DateOnly date);
    public Task<Result<bool>> DeleteDailyStatisticsAsync(Guid statisticId);
    public Task<Result<bool>> RecalculateDailyStatisticsAsync(Guid userId, DateOnly date);
    public Task<Result<bool>> DailyStatisticsExistAsync(Guid userId, DateOnly date);
    
    public Task<Result<ExerciseStatisticsGetResponse>> GetExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> CreateExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> DeleteExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> RecalculateExerciseStatisticsAsync(Guid userId, Guid statisticId);
}