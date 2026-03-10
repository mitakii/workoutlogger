using System.ComponentModel.DataAnnotations;

namespace BusinessLayer.DTO;

public class ExerciseTranslationCreateRequest
{
    public string? ExerciseId {get; set;}
    [Required]
    [MaxLength(5)]
    public string Language {get; set;}
    [Required]
    [MaxLength(50)]
    public string Name {get; set;}
    [Required]
    [MaxLength(100)]
    public string Description {get; set;}
}