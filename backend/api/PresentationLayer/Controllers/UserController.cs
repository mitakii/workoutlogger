using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using PresentationLayer.DTO;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[Authorize]
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
    
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetProfileById(Guid userId)
    {
        var result = await _userService.GetUserAsync(userId);
        return result.Succeeded ? Ok(result.Data) : NotFound();
    }
    
    [HttpGet("{username}")]
    public async Task<IActionResult> GetProfileByName(string username)
    {
        if (string.IsNullOrEmpty(username))
            return BadRequest();

        var result = await _userService.GetUserByNameAsync(username);
        return result.Succeeded ? Ok(result.Data) : NotFound();
    }
    
    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] SearchRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values
                .SelectMany(v => v.Errors
                    .Select(e => e.ErrorMessage)));
        
        var result = await _userService.GetPagedUsersAsync(request.Query,  request.Page, request.PageSize);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpPatch("changeLanguage")]
    public async Task<IActionResult> ChangeLanguage(ChangeLanguageRequest request)
    {
        if (string.IsNullOrEmpty(request.NewLanguage))
            return BadRequest();
        
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var user  = await _userManager.FindByIdAsync(userId.ToString());
        if(user == null)
            return NotFound("User not found");
        
        if(! await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Invalid password");
        
        var result = await _userService.ChangeUserLanguageAsync(userId, request.NewLanguage);

        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [HttpPatch("changeUsername")]
    public async Task<IActionResult> ChangeUsername(ChangeUsernameRequest request)
    {
        if(string.IsNullOrEmpty(request.NewUsername))
            return BadRequest("Username is empty");
        
        if( await _userManager.FindByNameAsync(request.NewUsername)  != null)
            return BadRequest("Username already exists");
        
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var user  = await _userManager.FindByIdAsync(userId.ToString());
        if(user == null)
            return NotFound("User not found");
        
        if(!await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Invalid password");
        
        if(user.UserName == request.NewUsername)
            return BadRequest("Username is the same");
        
        var result = await _userService.ChangeUsernameAsync(user, request.NewUsername);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpPatch("changePassword")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        if(string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
            return BadRequest("Passwords are empty");
        
        
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var user  = await _userManager.FindByIdAsync(userId.ToString());
        if(user == null)
            return NotFound("User not found");

        var passwordChange = await _userManager
            .ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        
        if(!passwordChange.Succeeded)
            return BadRequest("Passwords do not match");
        
        return Ok();
    }
}