using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class ExerciseTranslations
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Language { get; set; }
    public Guid ExerciseId { get; set; }
    [ForeignKey("ExerciseId")]
    public Exercise Exercise { get; set; } 
}