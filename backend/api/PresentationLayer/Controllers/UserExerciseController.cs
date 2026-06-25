using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserExerciseController : ControllerBase
{
    readonly IUserSetService _userSetService;
    public UserExerciseController(IUserSetService userSetService)
    {
        _userSetService = userSetService;
    }
    
    [HttpGet("userSet/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _userSetService.GetUserSetAsync(id);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpPost("{exerciseId:guid}")]
    public async Task<IActionResult> AddSet(Guid exerciseId, double weight, int reps)
    {
        var result = await _userSetService.CreateUserSetAsync(exerciseId, weight, reps);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpGet("userSets/{exerciseId:guid}")]
    public async Task<IActionResult> GetAllSets(Guid exerciseId)
    {
        var result = await _userSetService.GetUserSetsAsync(exerciseId);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [HttpDelete("userSet/{setId:guid}")]
    public async Task<IActionResult> DeleteSet(Guid setId)
    {
        var result = await  _userSetService.DeleteUserSetAsync(setId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [HttpPatch("userSet/{setId:guid}")]
    public async Task<IActionResult> UpdateSet
        (Guid setId, [FromBody] UserExerciseSetRequest request)
    {
        var result = await _userSetService.UpdateUserSetAsync(setId, request.Weight, request.Reps);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
}