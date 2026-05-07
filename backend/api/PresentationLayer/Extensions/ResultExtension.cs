using ApplicationLayer.Data.Enums;
using BusinessLayer.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Extensions;

public static class ResultExtension
{
    public static IActionResult ToIActionResultErrors<T>(this Result<T> result)
    {
        var response = new
        {
            errors = result.ErrorMessages
        };
        return result.Code switch
        {
            ErrorCode.BadRequest => new BadRequestObjectResult(response),
            ErrorCode.Unauthorized => new UnauthorizedObjectResult(response),
            ErrorCode.NotFound => new NotFoundObjectResult(response),
            ErrorCode.InternalError => new StatusCodeResult(StatusCodes.Status500InternalServerError),
            _ => new BadRequestObjectResult(response)
        };
    }
}