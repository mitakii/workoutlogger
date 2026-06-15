namespace BusinessLayer.DTO;

public class WorkoutsGetRequest
{
    public Guid UserId { get; set; }
    public string WorkoutId { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}