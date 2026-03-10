using System.ComponentModel.DataAnnotations;

namespace BusinessLayer.DTO;

public class ExerciseCreateRequest
{
    [Required]
    [MaxLength(50)]
    public string NameTag {get; set;}
    public string MediaUrl {get; set;}
    [MaxLength(200)]
    public string Description {get; set;}
    public ICollection<ExerciseTranslationCreateRequest> Translations { get; set; } = [];
}
