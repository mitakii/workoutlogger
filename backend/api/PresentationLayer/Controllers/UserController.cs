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
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly UserManager<User> _userManager;

    public UserController(IUserService userService, UserManager<User> userManager)
    {
        _userService = userService;
        _userManager = userManager;
    }
    
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            return BadRequest();

        var result = await _userService.GetUserAsync(userId);
        return result.Succeeded ? Ok(result.Data) : NotFound();
    }

    [Authorize]
    [HttpPost("language")]
    public async Task<IActionResult> ChangeLanguage(string language)
    {
        if (string.IsNullOrEmpty(language))
            return BadRequest();
        
        var userId = User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;
            
        var result = await _userService.ChangeUserLanguageAsync(userId, language);
        return result.Succeeded ? Ok(result.Data) : NotFound();
    }
}