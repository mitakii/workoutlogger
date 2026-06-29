using System.Security.Claims;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.DTO;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

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
    [HttpPatch("copyFromTemplate")]
    public async Task<IActionResult> CopyTemplateSession([FromBody]CopySession request)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var userLanguage =await _userService.GetUserLanguageAsync(userId);
        if(!userLanguage.Succeeded)
            return userLanguage.ToIActionResultErrors();
        
        var result = await _workoutTemplate
            .CopyWorkoutSessionAsync(userLanguage.Data!, request.NewWorkoutId, request.TemplateWorkoutId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    public async Task<IActionResult> MarkSessionAsTemplate(Guid workoutId)
    {
        return Ok();
    }
}