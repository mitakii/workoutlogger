using System.IdentityModel.Tokens.Jwt;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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
    [HttpPost("stop")]
    public async Task<IActionResult> Stop(string id)
    {
        if (string.IsNullOrEmpty(id))
            return BadRequest();
        
        var result =  await _workoutService.StopAsync(id);

        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }
}