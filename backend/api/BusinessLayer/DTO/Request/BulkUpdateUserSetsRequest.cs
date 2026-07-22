namespace BusinessLayer.DTO;

public class BulkUpdateUserSetsRequest
{
    public List<UserSetUpdateItem> Sets { get; set; } = new();
}

public class UserSetUpdateItem
{
    public Guid Id { get; set; }
    public double Weight { get; set; }
    public int Reps { get; set; }
}
