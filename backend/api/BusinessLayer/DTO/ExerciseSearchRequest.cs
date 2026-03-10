using System.ComponentModel.DataAnnotations;

namespace BusinessLayer.DTO;

public class ExerciseSearchRequest
{
    public string Query { get; set; }
    [MaxLength(3)]
    public string Language { get; set; }
    //hehe
    [MaxLength(int.MaxValue)]
    public int Page { get; set; }
    [Required]
    [MaxLength(int.MaxValue)]
    public int PageSize { get; set; }
}