namespace BusinessLayer.DTO;

public class TemplateGetResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<ExerciseGetResponse> Exercises { get; set; }
}