namespace BusinessLayer.DTO;

public class UserSetGetResponse
{
    public string ExerciseId { get; set; }
    public string SetId { get; set; }
    public double Weight { get; set; }
    public int Reps { get; set; }
    public int Order { get; set; }
}