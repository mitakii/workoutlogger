using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly UserManager<User> _userManager;

    public UserController(IUserService userService, UserManager<User> userManager)
    {
        _userService = userService;
        _userManager = userManager;
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Get()
    {
        var user = await _userManager.FindByIdAsync(
            User.FindFirstValue(ClaimTypes.NameIdentifier));

        return Ok(user.UserName);
    }
    
}