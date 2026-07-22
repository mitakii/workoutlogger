using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Http;

namespace BusinessLayer.DTO;

public class UserRegisterRequest
{
    public IFormFile? ProfilePicture { get; set; }
    [Required]
    [MinLength(4)]
    [MaxLength(20)]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [MaxLength(4)]
    public string Language { get; set; }
    
}