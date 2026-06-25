using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExerciseController : ControllerBase
{
    private readonly IExerciseService _exerciseService;
    private readonly UserManager<User> _userManager;
    private readonly IUserService _userService;

    public ExerciseController(IExerciseService exerciseService, UserManager<User> userManager, IUserService userService)
    {
        _exerciseService = exerciseService;
        _userManager = userManager;
        _userService = userService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(ExerciseCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        
        var result = await _exerciseService.CreateAsync(request);
        return result.Succeeded ? Ok(new
        {
            id = result.Data
        }) : result.ToIActionResultErrors();
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete("{exerciseId:guid}")]
    public async Task<IActionResult> Delete(Guid exerciseId)
    {
        var result = await _exerciseService.DeleteAsync(exerciseId);
        return result.Succeeded ? Ok() : result.ToIActionResultErrors();
    }

    [Authorize(Roles = "Admin")]
    //todo: later move to separate controller 
    [HttpPost("translations")]
    public async Task<IActionResult> AddTranslation(ExerciseTranslationCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values
                .SelectMany(v => v.Errors.Select(e => e.ErrorMessage)));

        var result = await _exerciseService.AddTranslationAsync(request);
        return result.Succeeded ? Ok() : result.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpGet("{exerciseId:guid}")]
    public async Task<IActionResult> Get(Guid exerciseId)
    {
        var result = await _exerciseService.GetByIdAsync(exerciseId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values
                .SelectMany(v => v.Errors
                    .Select(e => e.ErrorMessage)));

        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        
        var result = await _exerciseService.GetAllAsync(request, userLanguage.Data!);
        return result.Succeeded ? Ok(result.Data): result.ToIActionResultErrors();
    }
}