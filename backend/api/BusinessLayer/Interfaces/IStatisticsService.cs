using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface IStatisticsService
{
    public Task<Result<bool>> RecalculateStreak(Guid userId);
    
    public Task<Result<GetUserStatisticResponse>> GetUserStatisticsAsync(Guid userId);
    public Task<Result<bool>> CreateStatisticsAsync(Guid userId);
    public Task<Result<bool>> DeleteStatisticsAsync(Guid userId);
    public Task<Result<bool>> UpdateUserStatisticsAsync(Guid userId, UpdateUserStatisticDto newUserStatistic);
    public Task<Result<bool>> RecalculateUserStatisticsAsync(Guid userId);
    
    public Task<Result<List<DailyStatisticsGetResponse>>> GetDailyStatisticsRangeAsync(Guid userId, DateTime start, DateTime end);
    public Task<Result<DailyStatisticsGetResponse>> GetDailyStatisticsAsync(Guid userId, DateTime date);
    public Task<Result<bool>> CreateDailyStatisticsAsync(Guid userId, DateTime date);
    public Task<Result<bool>> DeleteDailyStatisticsAsync(DateTime date);
    public Task<Result<bool>> DeleteDailyStatisticsAsync(Guid statisticId);
    public Task<Result<bool>> UpdateDailyStatisticsAsync(Guid userId, UpdateDailyStatisticsDto newDailyStatistic);
    public Task<Result<bool>> RecalculateDailyStatisticsAsync(Guid userId, Guid statisticId);
    public Task<Result<bool>> RecalculateDailyStatisticsAsync(Guid userId, DateTime date);
    
    
    public Task<Result<ExerciseStatisticsGetResponse>> GetExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> CreateExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> DeleteExerciseStatisticsAsync(Guid userId, Guid exerciseId);
    public Task<Result<bool>> UpdateExerciseStatisticsAsync(Guid userId, UpdateExerciseStatisticsDto exerciseStatistic);
    public Task<Result<bool>> RecalculateExerciseStatisticsAsync(Guid userId, Guid statisticId);
}