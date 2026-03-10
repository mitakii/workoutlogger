namespace BusinessLayer.DTO;

public class WorkoutGetRequest
{
    public string UserId { get; set; }
    public string WorkoutId { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}