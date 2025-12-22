using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;

namespace DataAccessLayer.Repository;

public class ExerciseRepository : IExerciseRepository
{
    public Exercise GetExercise(int id)
    {
        throw new NotImplementedException();
    }

    public ICollection<Exercise> GetExercises(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Exercise Add(Exercise exercise)
    {
        throw new NotImplementedException();
    }

    public Exercise Update(Exercise exercise)
    {
        throw new NotImplementedException();
    }

    public Exercise Delete(Exercise exercise)
    {
        throw new NotImplementedException();
    }

    public Exercise AddSet(Exercise exercise, ExerciseSet exerciseSet)
    {
        throw new NotImplementedException();
    }

    public Exercise UpdateSet(Exercise exercise, ExerciseSet exerciseSet)
    {
        throw new NotImplementedException();
    }

    public Exercise DeleteSet(Exercise exercise, ExerciseSet exerciseSet)
    {
        throw new NotImplementedException();
    }
}