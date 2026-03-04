using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Entities;

public class Workout
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Notes { get; set; }
    public DateTime DateStarted { get; set; }
    public DateTime DateCompleted { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
    public Guid UserId { get; set; }
    public ICollection<UserExercise> UserExercises { get; set; } =  new List<UserExercise>();
}