namespace DataAccessLayer.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    public ICollection<Tag> Tags { get; set; }
    
    public ICollection<ExerciseSet>  Sets { get; set; }
}