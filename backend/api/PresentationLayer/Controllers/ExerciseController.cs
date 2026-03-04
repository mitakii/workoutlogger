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

[Authorize(Roles =  "Admin")]
    [HttpPost("create")]
    public async Task<IActionResult> Create(ExerciseCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        
        var exercise = new Exercise
        {
            NameTag = request.NameTag,
            Translations = request.Translations
                .Select(t => new ExerciseTranslations
                {
                    Name = t.Name,
                    Description = t.Description,
                    Language = t.Language
                }).ToList(),
        };
        
        var result = await _exerciseService.CreateAsync(exercise);
        if (!result.Succeeded)
            return result.ToIActionResultErrors();
        return Ok();
    }
    
    
}