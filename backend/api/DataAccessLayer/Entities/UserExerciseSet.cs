using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class UserExerciseSet
{
    public string Id { get; set; }
    public Guid ExerciseId { get; set; }
    [ForeignKey(nameof(ExerciseId))]
    public UserExercise Exercise { get; set; }
    
    public int Reps { get; set; }
    public double Weight {get; set;}
}