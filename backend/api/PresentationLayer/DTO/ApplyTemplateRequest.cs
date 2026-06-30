namespace PresentationLayer.DTO;

public class ApplyTemplateRequest
{
    public Guid NewWorkoutId { get; private set; }
    public Guid TemplateWorkoutId { get; private set; }
}