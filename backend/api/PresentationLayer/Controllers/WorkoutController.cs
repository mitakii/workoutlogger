using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }
    
   
    [Authorize]
    [HttpPost("start")]
    public async Task<IActionResult> Start()
    {
        string userId = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            userId = identity.FindFirst(ClaimTypes.Sid)?.Value;
        }
        if (userId == null)
            return NotFound("user is not found");
        
        var result =  await _workoutService.StartAsync(userId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("lastWorkout")]
    public async Task<IActionResult> GetLastWorkout()
    {
        string userId = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            userId = identity.FindFirst(ClaimTypes.Sid)?.Value;
        }
        if (userId == null)
            return NotFound("user is not found");

        
        string language = null;
        if (identity != null)
        {
            language = identity.FindFirst(ClaimTypes.Locality)?.Value;
        }
        else return Unauthorized();
        
        if (language == null)
            return BadRequest("unknown language");
        
        var result  = await _workoutService.GetLastWorkoutAsync(userId, language);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpGet("{workoutId}")]
    public async Task<IActionResult> GetWorkout(string workoutId)
    {
        if (string.IsNullOrEmpty(workoutId))
            return BadRequest();
        
        var language = User.FindFirst(ClaimTypes.Locality)?.Value;
        
        var result = await _workoutService.GetByIdAsync(workoutId, language);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpDelete("{workoutId}")]
    public async Task<IActionResult> DeleteWorkout(string workoutId)
    {
        if (string.IsNullOrEmpty(workoutId))
            return BadRequest();
        
        var result = await _workoutService.DeleteAsync(workoutId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("{workoutId}/exercise/{exerciseId}")]
    public async Task<IActionResult> AddExercise(string workoutId, string exerciseId)
    {
        if (string.IsNullOrEmpty(workoutId) || string.IsNullOrEmpty(exerciseId))
            return BadRequest();

        string language = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            language = identity.FindFirst(ClaimTypes.Locality)?.Value;
        }
        else return Unauthorized();
        if(language == null)
            return BadRequest("unknown language");
        var result = await _workoutService.AddUserExerciseAsync(workoutId, exerciseId, language);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpDelete("{workoutId}/exercise/{exerciseId}")]
    public async Task<IActionResult> RemoveExercise(string exerciseId)
    {
        if (string.IsNullOrEmpty(exerciseId))
            return BadRequest();

        var result = await _workoutService.RemoveUserExerciseAsync(exerciseId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }


    [Authorize]
    [HttpGet("{workoutId}/exercises")]
    public async Task<IActionResult> GetWorkoutExercises(string workoutId)
    {
        if(string.IsNullOrEmpty(workoutId))
            return BadRequest("id cant be empty");
        
        //todo: refactor ts
        string language = null;
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity != null)
        {
            language = identity.FindFirst(ClaimTypes.Locality)?.Value;
        }
        else return Unauthorized();
        if(language == null)
            return BadRequest("unknown language");

        var result = await _workoutService.GetAllExercisesAsync(workoutId, language);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }
}