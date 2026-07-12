namespace DataAccessLayer.Statistics;

public class StatisticsUpdateQueue
{
    public Guid Id { get; private set; }
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public bool Dirty {get; set;}
    public DateTime LastModified { get; set; }
}