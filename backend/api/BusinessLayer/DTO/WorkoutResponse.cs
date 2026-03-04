using DataAccessLayer.Entities;

namespace BusinessLayer.DTO;

public class WorkoutResponse
{
    public string WorkoutId { get; set; }
    public string WorkoutName { get; set; }
    public string WorkoutDescription { get; set; }
    public string UserId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public ICollection<UserExerciseGetResponse> UserExercises { get; set; }
}