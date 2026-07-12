using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class Workout
{
    public Guid Id { get; set; }
    public DateOnly DateOnlyCreated { get; set; }
    public DateTime ExactTimeCreated { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
    public Guid UserId { get; set; }
    public ICollection<UserExercise> UserExercises { get; set; } =  new List<UserExercise>();
}