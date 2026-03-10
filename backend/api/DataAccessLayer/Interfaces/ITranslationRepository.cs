using DataAccessLayer.Entities;

namespace BusinessLayer.Interfaces;

public interface ITranslationRepository
{
    public Task<ExerciseTranslations> GetExerciseTranslation(Guid exerciseId, string language);
    public Task<Dictionary<Guid, ExerciseTranslations>> GetExerciseTranslationsAsync(IEnumerable<Guid> exerciseIds, string language);
    
}