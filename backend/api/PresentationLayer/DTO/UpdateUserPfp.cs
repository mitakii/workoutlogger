namespace PresentationLayer.DTO;

public class UpdateUserPfp
{
    public IFormFile ProfilePicture { get; set; }
    public string Password { get; set; }
}