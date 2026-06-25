using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using PresentationLayer.DTO;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly IUserService _userService;
    private readonly UserManager<User>  _userManager;

    public WorkoutController(IWorkoutService workoutService,  IUserService userService, UserManager<User> userManager)
    {
        _workoutService = workoutService;
        _userService = userService;
        _userManager = userManager;
    }
    
    [Authorize]
    [HttpPost("start")]
    public async Task<IActionResult> Start()
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var result =  await _workoutService.StartAsync(userId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("lastWorkout")]
    public async Task<IActionResult> GetLastWorkout()
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result  = await _workoutService.GetLastWorkoutAsync(userId, userLanguage.Data!);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpGet("{workoutId:guid}")]
    public async Task<IActionResult> GetWorkout(Guid workoutId)
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutService.GetByIdAsync(workoutId, userLanguage.Data!);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpDelete("{workoutId:guid}")]
    public async Task<IActionResult> DeleteWorkout(Guid workoutId)
    {
        var result = await _workoutService.DeleteAsync(workoutId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("{workoutId:guid}/exercise/{exerciseId:guid}")]
    public async Task<IActionResult> AddExercise(Guid workoutId, Guid exerciseId)
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid).Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutService.AddUserExerciseAsync(workoutId, exerciseId, userLanguage.Data!);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpDelete("{workoutId:guid}/exercise/{exerciseId:guid}")]
    public async Task<IActionResult> RemoveUserExercise(Guid exerciseId)
    {
        var result = await _workoutService.RemoveUserExerciseAsync(exerciseId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpGet("{workoutId:guid}/exercises")]
    public async Task<IActionResult> GetWorkoutExercises(Guid workoutId)
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();

        var result = await _workoutService.GetAllExercisesAsync(workoutId, userLanguage.Data!);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("userWorkouts")]
    public async Task<IActionResult> GetUserWorkouts([FromQuery]WorkoutsGetRequest request)
    {
        if (request.PageSize <= 0 |  request.Page < 1)
            return BadRequest();

        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutService.GetAllUserWorkoutsAsync(request, userLanguage.Data!);

        if (!result.Succeeded)
            return result.ToIActionResultErrors();
        
        return Ok(result.Data);
    }

    [Authorize]
    [HttpPatch("copyFromTemplate")]
    public async Task<IActionResult> CopyTemplateSession([FromBody]CopySession request)
    {
        if (Guid.TryParse(User.FindFirst(ClaimTypes.Sid)!.Value, out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutService
            .CopyWorkoutSessionAsync(userLanguage.Data!, request.NewWorkoutId, request.TemplateWorkoutId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
}