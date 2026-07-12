namespace BusinessLayer.DTO;

public class DailyStatisticsGetResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    public DateTime Date { get; set; }
    
    public int TotalWorkouts { get; set; }
    public double TotalVolume { get; set; }
    public double TotalDistanceKm { get; set; }
}