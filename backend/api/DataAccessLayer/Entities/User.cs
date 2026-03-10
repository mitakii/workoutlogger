using Microsoft.AspNetCore.Identity;

namespace DataAccessLayer.Entities;

public class User : IdentityUser<Guid>
{
    public string? Description {get; set;}
    public string? UserPfpUrl  {get; set;}
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public string Language {get; set;} = "en";
    
}