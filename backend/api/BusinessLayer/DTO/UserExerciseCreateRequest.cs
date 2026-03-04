using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTO;

public class UserExerciseCreateRequest
{
    public string WorkoutId { get; set; }
    public string ExerciseId { get; set; }
    
}