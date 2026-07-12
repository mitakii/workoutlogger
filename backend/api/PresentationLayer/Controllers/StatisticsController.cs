using BusinessLayer.Interfaces;
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

    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        var result = await _statistics.GetUserStatisticsAsync(userId);
        
        return result.Succeeded ? Ok(result) : result.ToIActionResultErrors();
    }
    
    
}