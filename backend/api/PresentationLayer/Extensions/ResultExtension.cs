using ApplicationLayer.Data.Enums;
using BusinessLayer.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Extensions;

public static class ResultExtension
{
    public static IActionResult ToIActionResultErrors<T>(this Result<T> result)
    {
        return result.Code switch
        {
            ErrorCode.BadRequest => new BadRequestObjectResult(result.ErrorMessage),
            ErrorCode.Unauthorized => new UnauthorizedObjectResult(result.ErrorMessage),
            ErrorCode.NotFound => new NotFoundObjectResult(result.ErrorMessage),
            ErrorCode.InternalError => new StatusCodeResult(StatusCodes.Status500InternalServerError),
            _ => new BadRequestObjectResult(result.ErrorMessage)
        };
    }
}