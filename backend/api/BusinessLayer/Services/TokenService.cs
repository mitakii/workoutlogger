using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ApplicationLayer.Data.Enums;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace BusinessLayer.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly SymmetricSecurityKey _signingKey;
    private readonly UserManager<User> _userManager;
    
    public TokenService(IConfiguration config, UserManager<User> userManager)
    {
        _config = config;
        
        if(_config["JWT:SigningKey"] == null)
            throw new NullReferenceException("SigningKey cannot be null");
        
        _signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["JWT:SigningKey"] ?? throw new InvalidOperationException()));
        _userManager = userManager;
    }
    
    public async Task<Result<string>> CreateTokenAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if(user == null)
            return Result<string>.Failed(ErrorCode.BadRequest,"User not found");

        var roles = await _userManager.GetRolesAsync(user);
        
        var claims = new List<Claim>
        {
            new (JwtRegisteredClaimNames.GivenName, user.UserName!),
            new (JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new (JwtRegisteredClaimNames.Email,  user.Email!),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha512Signature),
            Issuer = _config["JWT:Issuer"],
            Audience = _config["JWT:Audience"]
        });
        
        return Result<string>.Success( tokenHandler.WriteToken(token));
    }
}