namespace DataAccessLayer.Entities;

public class DailyStatistics
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User  User { get; set; }
    
    public DateOnly Date { get; set; }

    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    
    public int TotalWorkouts { get; set; }
    public int TotalExercises { get; set; }
    public int TotalSets { get; set; }
    public double TotalVolume { get; set; }
    public double TotalDistanceKm { get; set; }
}