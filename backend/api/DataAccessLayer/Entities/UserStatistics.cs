namespace DataAccessLayer.Entities;

public class UserStatistics
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public int TotalWorkouts { get; set; } 
    public int TotalExercises { get; set; } 
    public int TotalSets { get; set; } 
    public double TotalVolume { get; set; } 
    public double TotalDistanceKm { get; set; }
    
    public int ConsecutiveWeeksActive { get; set; } 
    public int LongestWeekStreak { get; set; } 
    
    public double MaxBenchPress { get; set; }
    public double MaxDeadlift { get; set; }
    public double MaxSquat { get; set; }
    
    public DateTime LastUpdated { get; set; } 
}