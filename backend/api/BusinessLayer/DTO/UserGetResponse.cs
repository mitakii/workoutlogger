namespace BusinessLayer.DTO;

public class UserGetResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Description { get; set; }
    public string PfpUrl { get; set; }
}