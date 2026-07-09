using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Controllers;

[ApiController]
public class ErrorController : ControllerBase
{
    [Route("/error")]
    public IActionResult Error()
    {
        return Problem(title: "An error occured", statusCode: 500);
    }
}