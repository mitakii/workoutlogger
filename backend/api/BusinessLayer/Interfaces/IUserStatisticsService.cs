using BusinessLayer.DTO;
using BusinessLayer.Exceptions;

namespace BusinessLayer.Interfaces;

public interface IUserStatisticsService
{
    public Task<Result<GetUserStatisticResponse>> GetUserStatistics(Guid userId);
    
    public Task<Result<bool>> CreateStatistic(Guid userId);
    public Task<Result<bool>> DeleteStatistic(Guid userId);
    
    public Task<Result<bool>> UpdateStatistic(Guid userId, UpdateUserStatisticDto newUserStatistic);
    public Task<Result<bool>> RecalculateStatistics(Guid userId);
}