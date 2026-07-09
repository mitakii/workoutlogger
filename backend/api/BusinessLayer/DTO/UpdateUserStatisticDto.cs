namespace BusinessLayer.DTO;

public class UpdateUserStatisticDto
{
    // += later
    public int TotalWorkouts { get; set; }
    public int TotalExercises { get; set; }
    public int TotalSets { get; set; }
    public double TotalVolume { get; set; }
    public double TotalDistanceKm { get; set; }
    
    public int ConsecutiveWeeksActive { get; set; }
    public int TotalMonthsStreak { get; set; }
    public int LongestStreak { get; set; }
    
    
    public double MaxBenchPress { get; set; }
    public double MaxDeadlift { get; set; }
    public double MaxSquat { get; set; }
}