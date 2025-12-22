using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.DTO;

public class RegisterDTO
{
    [Required]
    [MinLength(4)]
    public string Username { get; set; }
    [Required]
    [PasswordPropertyText]
    public string Password { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}