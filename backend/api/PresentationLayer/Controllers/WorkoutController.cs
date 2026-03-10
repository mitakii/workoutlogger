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
        var userId = User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;
        if (userId == null)
            return Unauthorized();
        
        var result =  await _workoutService.StartAsync(userId);
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("{workoutId}")]
    public async Task<IActionResult> GetWorkout(string workoutId)
    {
        if (string.IsNullOrEmpty(workoutId))
            return BadRequest();
        
        var language = User.FindFirst(ClaimTypes.Locality)?.Value;
        
        var result = await _workoutService.GetByIdAsync(workoutId, language);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpDelete("{workoutId}")]
    public async Task<IActionResult> DeleteWorkout(string workoutId)
    {
        if (string.IsNullOrEmpty(workoutId))
            return BadRequest();
        
        var result = await _workoutService.DeleteAsync(workoutId);
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("{workoutId}/exercise/{exerciseId}")]
    public async Task<IActionResult> AddExercise(string workoutId, string exerciseId)
    {
        if (string.IsNullOrEmpty(workoutId) || string.IsNullOrEmpty(exerciseId))
            return BadRequest();

        var result = await _workoutService.AddUserExerciseAsync(workoutId, exerciseId);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpDelete("{workoutId}/exercise/{exerciseId}")]
    public async Task<IActionResult> RemoveExercise(string exerciseId)
    {
        if (string.IsNullOrEmpty(exerciseId))
            return BadRequest();

        var result = await _workoutService.RemoveUserExerciseAsync(exerciseId);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }
}