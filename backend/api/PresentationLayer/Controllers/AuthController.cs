using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PresentationLayer.Attributes;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ITokenService _tokenService;
    private readonly JwtOptions _jwtOptions;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IBackgroundJobService _jobs;
    private readonly ICloudinaryService _cloudinary;

    public AuthController(ILogger<AuthController> logger,
        ITokenService tokenService,
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IOptions<JwtOptions> jwtOptions,
        IBackgroundJobService jobs, ICloudinaryService cloudinary)
    {
        _logger = logger;
        _tokenService = tokenService;
        _userManager = userManager;
        _signInManager = signInManager;
        _jobs = jobs;
        _cloudinary = cloudinary;
        _jwtOptions = jwtOptions.Value;
    }
    
    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if(user == null) return NotFound("user not found ");

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        var role = isAdmin ? "Admin" : "User";
        return Ok(new
        {
            username = user.UserName,
            user.Email,
            user.Id,
            user.Language,
            role
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
        
        tokens.Data!.SetTokensToCookie(HttpContext, _jwtOptions);
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
            return Unauthorized();

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!signInResult.Succeeded)
            return Unauthorized();

        await _tokenService.RevokeRefreshTokenByUIdAsync(user.Id);
        
        var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user);
        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        
        new TokenDTO
        {
            RefreshToken = refreshToken.Data!,
            AccessToken = accessToken.Data!,
        }.SetTokensToCookie(HttpContext, _jwtOptions);

        return Ok(new
        {
            user.UserName,
            user.Email,
            user.Id,
            user.Language
        });
    }

    [AllowAnonymous]
    [ValidateImage]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] UserRegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
        
        var pfpResult = await _cloudinary.AddPhotoAsync(request.ProfilePicture);
        if (!pfpResult.Succeeded)
            return pfpResult.ToIActionResultErrors();
        
        var user = new User
        {
            UserName = request.Username,
            Email = request.Email,
            Language =  request.Language,
            UserPfpUrl = pfpResult.Data.Url.AbsoluteUri,
        };
        var userResult = await _userManager.CreateAsync(user, request.Password);

        if (!userResult.Succeeded)
            return BadRequest(userResult.Errors);
        
        await _userManager.AddToRoleAsync(user, "User");
        
        _jobs.Enqueue<IStatisticsService>(x => x.CreateStatisticsAsync(user.Id));
        
        return Ok();
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        await _tokenService.RevokeRefreshTokenByUIdAsync(userId);
        
        new TokenDTO{AccessToken = "", RefreshToken = ""}.SetTokensToCookie(HttpContext, _jwtOptions);
        return Ok();
    }
}