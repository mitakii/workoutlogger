using System.ComponentModel.DataAnnotations;

namespace BusinessLayer.DTO;

public class UserLoginRequest
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}