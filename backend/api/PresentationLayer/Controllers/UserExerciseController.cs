using BusinessLayer.DTO;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;
[ApiController]
[Route("api/[controller]")]
public class UserExerciseController : ControllerBase
{
    readonly IUserSetService _userSetService;
    public UserExerciseController(IUserSetService userSetService)
    {
        _userSetService = userSetService;
    }
    
    [HttpGet("userSet/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if(!Guid.TryParse(id.ToString(), out Guid guid))
            return BadRequest("id must be a valid guid");
        
        var result = await _userSetService.GetUserSetAsync(guid);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpPost("{exerciseId}")]
    public async Task<IActionResult> AddSet(string exerciseId, double weight, int reps)
    {
        if(!Guid.TryParse(exerciseId, out Guid exerciseGuid))
            return  BadRequest("id must be a valid guid");
        
        var result = await _userSetService.CreateUserSetAsync(exerciseGuid, weight, reps);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
    
    [HttpGet("userSets/{exerciseId}")]
    public async Task<IActionResult> GetAllSets(string exerciseId)
    {
        if(!Guid.TryParse(exerciseId, out Guid exerciseGuid))
            return BadRequest("id must be a valid guid");
        
        var result = await _userSetService.GetUserSetsAsync(exerciseGuid);
        
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [HttpDelete("userSet/{setId}")]
    public async Task<IActionResult> DeleteSet(string setId)
    {
        if(!Guid.TryParse(setId, out Guid setGuid))
            return BadRequest("id must be a valid guid");

        var result = await  _userSetService.DeleteUserSetAsync(setGuid);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [HttpPatch("userSet/{setId}")]
    public async Task<IActionResult> UpdateSet
        (string setId, [FromBody] UserExerciseSetRequest request)
    {
        if(!Guid.TryParse(setId, out Guid setGuid))
            return BadRequest("id must be a valid guid");
        
        var result = await _userSetService.UpdateUserSetAsync(setGuid, request.Weight, request.Reps);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }
}