using Microsoft.AspNetCore.Identity;

namespace DataAccessLayer.Entities;

public class User : IdentityUser<Guid>
{
    public string? Description {get; set;}
    public ICollection<Workout> Workouts { get; set; }
}