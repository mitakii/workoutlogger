using System.Net;
using BusinessLayer.DTO;
using BusinessLayer.Services;
using Microsoft.AspNetCore.Authentication;

namespace PresentationLayer.Extensions;

public static class TokenCookieExtension
{
    public static void SetTokenToCookie(this TokenDTO tokens, 
        HttpContext context, JwtOptions options)
    {
        context.Response.Cookies.Append("refreshToken", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Path = "/api/refresh",
            Expires = DateTimeOffset.Now.AddDays(options.RefreshTokenDays) 
        });
        context.Response.Cookies.Append("accessToken", tokens.AccessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.Now.AddHours(options.AccessTokenHours)
        });
    }
}