using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTO;

public class UserExerciseCreateRequest
{
    public Guid WorkoutId { get; set; }
    public Guid ExerciseId { get; set; }
    
}