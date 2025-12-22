using System.ComponentModel.DataAnnotations;

namespace DataAccessLayer.Entities;

public class Workout
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
    
    [Required]
    public User User { get; set; }
    public Guid UserId { get; set; }
    public ICollection<Exercise> Exercises { get; set; }
}