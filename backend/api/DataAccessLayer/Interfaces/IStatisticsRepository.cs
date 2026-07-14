using DataAccessLayer.Migrations;
using DataAccessLayer.Statistics;

namespace DataAccessLayer.Interfaces;

public interface IStatisticsRepository
{
    public Task<List<StatisticsUpdateQueue>> GetDirtyStatisticsOlderThan(TimeSpan timespan);
    public Task MarkDirty(Guid userId, DateOnly date);
    public Task MarkClean(Guid userId, DateOnly date);
}