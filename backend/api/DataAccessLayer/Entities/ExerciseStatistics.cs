namespace DataAccessLayer.Entities;

public class ExerciseStatistics
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; }
    
    public double MaxWeight { get; set; }
    public double MaxDuration { get; set; }
    public double MaxDistanceKm { get; set; }
    
    public double TotalWeight { get; set; }
    public int TotalSets { get; set; }
    public double TotalVolume { get; set; }
    
    public double TotalDuration { get; set; }
    public double TotalDistanceKm { get; set; }
    
    public DateTime LastTimeExecuted { get; set; }
}