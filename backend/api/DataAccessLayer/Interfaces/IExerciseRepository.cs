using DataAccessLayer.Entities;

namespace DataAccessLayer.Interfaces;

public interface IExerciseRepository
{
    public Exercise GetExercise(int id);
    public ICollection<Exercise> GetExercises(Guid userId);
    public Exercise Add(Exercise exercise);
    public Exercise Update(Exercise exercise);
    public Exercise Delete(Exercise exercise);
    
    public Exercise AddSet(Exercise exercise, ExerciseSet exerciseSet);
    public Exercise UpdateSet(Exercise exercise, ExerciseSet exerciseSet);
    public Exercise DeleteSet(Exercise exercise, ExerciseSet exerciseSet);
}