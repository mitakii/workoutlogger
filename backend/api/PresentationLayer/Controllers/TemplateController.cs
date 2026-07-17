using System.Security.Claims;
using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.DTO;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IWorkoutTemplate _workoutTemplate;

    public TemplateController(IUserService userService, IWorkoutTemplate workoutTemplate)
    {
        _userService = userService;
        _workoutTemplate = workoutTemplate;
    }

    [Authorize]
    [HttpPatch("applyTemplate")]
    public async Task<IActionResult> ApplyTemplate([FromBody] ApplyTemplateRequest request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var userLanguage = await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutTemplate
            .ApplyTemplateAsync(userId, userLanguage.Data!, request.WorkoutId, request.TemplateWorkoutId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("createTemplate")]
    public async Task<IActionResult> CreateTemplate(CreateTemplateRequest request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var template = await _workoutTemplate.CreateTemplateAsync(userId, request.Name, request.Description);
        
        return template.Succeeded ? Ok(template.Data) : template.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpDelete("deleteTemplate/{templateId:guid}")]
    public async Task<IActionResult> DeleteTemplate(Guid templateId)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var result =  await _workoutTemplate.DeleteTemplateAsync(userId, templateId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("{templateId:guid}/addExercise/{exerciseId:guid}")]
    public async Task<IActionResult> AddExercise(Guid templateId, Guid exerciseId)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var result = await _workoutTemplate.AddExerciseAsync(userId, templateId, exerciseId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpDelete("{templateId:guid}/deleteExercise/{exerciseId:guid}")]
    public async Task<IActionResult> DeleteExercise(Guid templateId, Guid exerciseId)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var result = await _workoutTemplate.DeleteExerciseAsync(userId, templateId, exerciseId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPost("toTemplate")]
    public async Task<IActionResult> WorkoutToTemplate([FromBody] CreateTemplateRequest request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        if (request.WorkoutId == Guid.Empty || request.WorkoutId == null)
            return BadRequest("workout id is required");
        
        var result = await _workoutTemplate.CreateTemplateFromWorkoutAsync(userId, request.WorkoutId.Value, request.Name, request.Description);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<IActionResult> SearchTemplate([FromQuery] SearchRequest request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();

        var userLanguage = await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result =
            await _workoutTemplate.SearchWorkoutTemplateAsync(request.Query, userId, request.Page, request.PageSize,
                userLanguage.Data);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpPatch("update/{templateId:guid}")]
    public async Task<IActionResult> UpdateTemplate(Guid templateId, string name, string description)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var result = await _workoutTemplate.UpdateTemplateAsync(userId, templateId, name, description);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("userTemplates")]
    public async Task<IActionResult> GetTemplate([FromQuery] InitialDataRequest request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var userLanguage = await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutTemplate.GetUserTemplatesAsync(userId, request.Page, request.PageSize, userLanguage.Data);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("userTemplate/{templateId:guid}")]
    public async Task<IActionResult> GetUserTemplate(Guid templateId)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var userLanguage = await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();

        var result = await _workoutTemplate.GetTemplateAsync(userId, templateId, userLanguage.Data);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
}