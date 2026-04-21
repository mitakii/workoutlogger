using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using PresentationLayer.Extensions;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ITokenService _tokenService;
    private readonly JwtOptions _jwtOptions;
    private readonly UserManager<User> _userManager;
    
    public AuthController(ILogger<AuthController> logger, 
        ITokenService tokenService,
        UserManager<User> userManager, 
        IOptions<JwtOptions> jwtOptions)
    {
        _logger = logger;
        _tokenService = tokenService;
        _userManager = userManager;
        _jwtOptions = jwtOptions.Value;
    }

    [Authorize]
    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        string userId = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            userId = identity.FindFirst(ClaimTypes.Sid)?.Value;
        }
        else return Unauthorized();
        
        var user = await _userManager.FindByIdAsync(userId);
        if(user == null) return NotFound("user not found ");
        
        return Ok(new
        {
            user.UserName,
            user.Email,
            user.Id,
            user.Language
        });
    }
    
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        if(!HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return Unauthorized("refreshToken not found");
        
        var tokens = await _tokenService.RefreshTokensAsync(refreshToken);
        if(!tokens.Succeeded)
            return tokens.ToIActionResultErrors();
        
        tokens.Data!.SetTokenToCookie(HttpContext, _jwtOptions);
        return Ok();
    }
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
        
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
            return BadRequest();
        
        if (await _userManager.IsLockedOutAsync(user))
            return Forbid();
        
        await _tokenService.RevokeRefreshTokenByUIdAsync(user.Id.ToString());

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized();

        var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user);
        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        
        new TokenDTO
        {
            RefreshToken = refreshToken.Data!,
            AccessToken = accessToken.Data!,
        }.SetTokenToCookie(HttpContext, _jwtOptions);

        return Ok(new
        {
            user.UserName,
            user.Email,
            user.Id,
            user.Language
        });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
    {
        var user = new User
        {
            UserName = request.Username,
            Email = request.Email,
            Language =  request.Language,
        };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);
        
        await _userManager.AddToRoleAsync(user, "User");
        return Ok();
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string userId = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            userId = identity.FindFirst(ClaimTypes.Sid)?.Value;
        }
        await _tokenService.RevokeRefreshTokenByUIdAsync(userId);
        
        new TokenDTO{AccessToken = "", RefreshToken = ""}.SetTokenToCookie(HttpContext, _jwtOptions);
        return Ok();
    }
    
    [Authorize]
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("would");
    }
}