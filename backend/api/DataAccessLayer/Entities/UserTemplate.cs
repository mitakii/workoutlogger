namespace DataAccessLayer.Entities;

public class UserTemplate
{
    public  Guid Id { get; set; }
    public string Name { get; set; }
    public string NameNormalized { get; set; }
    public string Description { get; set; }
    public Guid UserId { get; set; }
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}