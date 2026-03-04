namespace DataAccessLayer.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public string NameTag { get; set; } = "";
    public ICollection<ExerciseTranslations> Translations { get; set; } = new List<ExerciseTranslations>();
    public string MediaUrl { get; set; }
    public string Description { get; set; }
}