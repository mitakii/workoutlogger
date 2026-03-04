using DataAccessLayer.Entities;

namespace BusinessLayer.DTO;

public class UserExerciseGetResponse
{
    public string Id { get; set; }
    public string ExerciseName { get; set; }
    public string ImageUrl { get; set; }
    public string ExerciseDescription { get; set; }
    public ICollection<UserExerciseSet> Sets { get; set; }
}