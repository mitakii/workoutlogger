namespace BusinessLayer.DTO;

public class UpdateDailyStatisticsDto
{
    public Guid Id { get; set; }
    
    public DateTime Date { get; set; }
    
    public int TotalWorkouts { get; set; }
    public double TotalVolume { get; set; }
    public double TotalDistanceKm { get; set; }
}