using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTO;

public class UserRegisterRequest
{
    [Required]
    [MinLength(4)]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [MaxLength(4)]
    public string Language { get; set; }
    
    public IFormFile ProfilePicture { get; set; }
}