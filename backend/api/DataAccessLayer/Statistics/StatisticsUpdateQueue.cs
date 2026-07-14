namespace DataAccessLayer.Statistics;

public class StatisticsUpdateQueue
{
    public Guid Id { get; private set; }
    public Guid UserId { get; set; }
    // day statistics date
    public DateOnly Date { get; set; }
    public bool IsDirty {get; set;}
    public DateTime LastModified { get; set; }
}