using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class ExerciseSet
{
    public Guid ExerciseSetId { get; set; }
    
    [Required]
    public int Reps { get; set; }
    [Required]
    public double Weight {get; set;}
    
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; }
}