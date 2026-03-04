using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class UserExercise
{
    public Guid Id { get; set; }
    public Exercise RefExercise  { get; set; }
    public Workout Workout { get; set; }
    
    public ICollection<UserExerciseSet> UserExerciseSets { get; set; } = new List<UserExerciseSet>();
}