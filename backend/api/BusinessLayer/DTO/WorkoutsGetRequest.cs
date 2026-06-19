namespace BusinessLayer.DTO;

public class WorkoutsGetRequest
{
    public string Username { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}