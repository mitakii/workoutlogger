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

    public ExerciseController(IExerciseService exerciseService, UserManager<User> userManager)
    {
        _exerciseService = exerciseService;
        _userManager = userManager;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(ExerciseCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        
        var result = await _exerciseService.CreateAsync(request);
        return !result.Succeeded ? result.ToIActionResultErrors() : Ok();
    }
    
    [Authorize(Roles =  "Admin")]
    [HttpDelete("{exerciseId}")]
    public async Task<IActionResult> Delete(string exerciseId)
    {
        if (string.IsNullOrEmpty(exerciseId))
            return BadRequest();
        
        var result = await _exerciseService.DeleteAsync(exerciseId);
        return !result.Succeeded ? result.ToIActionResultErrors() : Ok();
    }

    [Authorize(Roles = "Admin")]
    //later move to separate controller 
    [HttpPost("translations")]
    public async Task<IActionResult> AddTranslation(ExerciseTranslationCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values
                .SelectMany(v => v.Errors.Select(e => e.ErrorMessage)));

        var result = await _exerciseService.AddTranslationAsync(request);
        return  !result.Succeeded ? result.ToIActionResultErrors() : Ok();
    }
    
    [HttpGet("{exerciseId}")]
    public async Task<IActionResult> Get(string exerciseId)
    {
        if (string.IsNullOrEmpty(exerciseId))
            return BadRequest();
        
        var result = await _exerciseService.GetByIdAsync(exerciseId);
        return !result.Succeeded ? result.ToIActionResultErrors() : Ok(result.Data);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(ExerciseSearchRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState.Values
                .SelectMany(v => v.Errors
                    .Select(e => e.ErrorMessage)));
        
        var result = await _exerciseService.GetAllAsync(request);
        return !result.Succeeded ? result.ToIActionResultErrors() : Ok(result.Data);
    }
}