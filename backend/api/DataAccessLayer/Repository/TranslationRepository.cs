using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repository;

public class TranslationRepository : ITranslationRepository
{
    public readonly AppDbContext _context;

    public TranslationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ExerciseTranslations?> GetExerciseTranslationAsync(Guid exerciseId, string language)
    {
        return await _context.ExerciseTranslations
            .FirstOrDefaultAsync(t => (t.Language == language || t.Language == "en") && t.ExerciseId == exerciseId);
    }

    public async Task<Dictionary<Guid, ExerciseTranslations>> GetExerciseTranslationsAsync(IEnumerable<Guid> exerciseIds, string language)
    {
        return  await _context.ExerciseTranslations
            .Where(t => (t.Language == language || t.Language == "en") && exerciseIds.Contains(t.ExerciseId))
            .ToDictionaryAsync(t => t.ExerciseId);
    }
}