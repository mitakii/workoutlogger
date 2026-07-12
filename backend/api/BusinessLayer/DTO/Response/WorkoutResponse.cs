using DataAccessLayer.Entities;

namespace BusinessLayer.DTO;

public class WorkoutResponse
{
    public Guid WorkoutId { get; set; }
    public Guid UserId { get; set; }
    public DateOnly StartTime { get; set; }
    public ICollection<UserExerciseGetResponse> UserExercises { get; set; }
}