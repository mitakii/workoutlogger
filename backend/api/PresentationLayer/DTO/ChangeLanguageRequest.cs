using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.DTO;

public class ChangeLanguageRequest
{
    [Required]
    public string NewLanguage { get; set; }
    public string Password { get; set; }
}