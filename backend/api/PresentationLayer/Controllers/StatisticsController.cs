using System.Security.Claims;
using ApplicationLayer.Data.Enums;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PresentationLayer.Extensions;

namespace PresentationLayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statistics;

    public StatisticsController(IStatisticsService statistics)
    {
        _statistics = statistics;
    }

    [Authorize]
    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserStatistics(Guid userId)
    {
        var result = await _statistics.GetUserStatisticsAsync(userId);
        return result.Succeeded ? Ok(result.Data) : result.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("day/{date:datetime}")]
    public async Task<IActionResult> GetDailyStatistics([FromRoute]DateTime date)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();

        var statistics = await _statistics
            .GetDailyStatisticsAsync(userId, DateOnly.FromDateTime(date));

        return statistics.Succeeded ? Ok(statistics.Data) : statistics.ToIActionResultErrors();
    }
    
    [Authorize]
    [HttpGet("day/from/{from:datetime}/to/{to:datetime}")]
    public async Task<IActionResult> GetDailyStatisticsRange([FromRoute]DateTime from, [FromRoute]DateTime to)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();

        var statistics = await _statistics
            .GetDailyStatisticsRangeAsync(userId, DateOnly.FromDateTime(from), DateOnly.FromDateTime(to));

        return statistics.Succeeded ? Ok(statistics.Data) : statistics.ToIActionResultErrors();
    }

    [Authorize]
    [HttpGet("exercise/{exerciseId:guid}")]
    public async Task<IActionResult> GetExerciseStatistics([FromRoute]Guid exerciseId)
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out var userId))
            return Unauthorized();
        
        var recalculate = await _statistics.RecalculateExerciseStatisticsAsync(userId, exerciseId);
        if (!recalculate.Succeeded)
            return recalculate.ToIActionResultErrors();
        
        var statistics = await _statistics.GetExerciseStatisticsAsync(userId, exerciseId);
        
        return statistics.Succeeded ? Ok(statistics.Data) : statistics.ToIActionResultErrors();
    }
}