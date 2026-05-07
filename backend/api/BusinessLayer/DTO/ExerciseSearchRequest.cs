using System.ComponentModel.DataAnnotations;

namespace BusinessLayer.DTO;

public class ExerciseSearchRequest
{
    public string Query { get; set; }
    public int Page { get; set; }
    [Required] public int PageSize { get; set; } = 1;
}