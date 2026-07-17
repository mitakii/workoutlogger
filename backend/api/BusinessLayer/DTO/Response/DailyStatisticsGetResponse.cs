namespace BusinessLayer.DTO;

public class DailyStatisticsGetResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    public DateOnly Date { get; set; }
    
    public IList<Guid> WorkouIds { get; set; }
    
    public int TotalWorkouts { get; set; }
    public double TotalVolume { get; set; }
    public double TotalDistanceKm { get; set; }
    public int TotalExercises { get; set; }
    public int TotalSets { get; set; }
}