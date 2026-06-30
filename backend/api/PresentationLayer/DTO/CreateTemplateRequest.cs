namespace PresentationLayer.DTO;

public class CreateTemplateRequest
{
    public Guid? WorkoutId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}