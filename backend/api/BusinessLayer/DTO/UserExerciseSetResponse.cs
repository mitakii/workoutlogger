namespace BusinessLayer.DTO;

public class UserExerciseSetResponse
{
    public Guid Id { get; set; }
    public double Weight { get; set; }
    public int Reps { get; set; }
    public int Order { get; set; }
}