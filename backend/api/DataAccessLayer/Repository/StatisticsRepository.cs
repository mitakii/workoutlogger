using DataAccessLayer.Data;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Statistics;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repository;

public class StatisticsRepository : IStatisticsRepository
{
    private readonly AppDbContext _context;

    public StatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StatisticsUpdateQueue>> GetDirtyStatisticsOlderThan(TimeSpan timespan)
    {
        var threshold = DateTime.UtcNow.Subtract(timespan);
        return await _context.StatisticsUpdateQueues
            .Where(x => x.Dirty && x.LastModified <= threshold)
            .ToListAsync();
    }

    public async Task MarkDirty(Guid userId, DateOnly date)
    {
        var item = await _context.StatisticsUpdateQueues
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);
        
        if (item == null)
        {
            item = new StatisticsUpdateQueue()
            {
                UserId = userId,
                Date = date,
            };
            _context.StatisticsUpdateQueues.Add(item);
        }

        item.Dirty = true;
        item.LastModified = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task MarkClean(Guid userId, DateOnly date)
    {
        var item = await _context.StatisticsUpdateQueues
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);

        if (item == null)
            return;

        item.Dirty = false;
        await _context.SaveChangesAsync();
    }
}