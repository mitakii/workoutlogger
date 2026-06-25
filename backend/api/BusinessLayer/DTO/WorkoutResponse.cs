using DataAccessLayer.Entities;

namespace BusinessLayer.DTO;

public class WorkoutResponse
{
    public Guid WorkoutId { get; set; }
    public string? WorkoutName { get; set; }
    public string? WorkoutNotes { get; set; }
    public Guid UserId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public ICollection<UserExerciseGetResponse> UserExercises { get; set; }
}