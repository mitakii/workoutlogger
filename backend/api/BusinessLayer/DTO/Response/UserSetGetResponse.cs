namespace BusinessLayer.DTO;

public class UserSetGetResponse
{
    public Guid ExerciseId { get; set; }
    public Guid SetId { get; set; }
    public double Weight { get; set; }
    public int Reps { get; set; }
    public int Order { get; set; }
}