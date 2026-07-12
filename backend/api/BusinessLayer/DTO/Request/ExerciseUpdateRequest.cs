namespace BusinessLayer.DTO;

public class ExerciseUpdateRequest
{
    public string Nametag {get; set;}
    public Guid Id {get; set;}
    public string Description {get; set;}
    public string MediaUrl {get; set;}
}