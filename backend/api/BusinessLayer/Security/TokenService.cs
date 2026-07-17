using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer;
using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace BusinessLayer.Security;

public class TokenService : ITokenService
{
    private readonly JwtOptions _jwtOptions;
    private readonly SymmetricSecurityKey _signingKey;
    private readonly UserManager<User> _userManager;
    private readonly ITokenRepository _tokenRepository;
    
    public TokenService(IOptions<JwtOptions> jwtOptions, 
        UserManager<User> userManager,  
        ITokenRepository tokenRepository)
    {
        _jwtOptions = jwtOptions.Value;
        
        if(_jwtOptions.SigningKey == null)
            throw new NullReferenceException("SigningKey cannot be null");
        
        _signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtOptions.SigningKey ?? throw new InvalidOperationException()));
        _userManager = userManager;
        _tokenRepository = tokenRepository;
    }
    
    public async Task<Result<string>> GenerateAccessTokenAsync(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        var claims = new List<Claim>
        {
            new (ClaimTypes.Name, user.UserName!),
            new (ClaimTypes.Sid, user.Id.ToString()),
            new (ClaimTypes.Email,  user.Email!),
            new (ClaimTypes.Locality, user.Language),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(_jwtOptions.AccessTokenHours),
            SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha512Signature),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience
        });
        
        return Result<string>.Success( tokenHandler.WriteToken(token));
    }

    public async Task<Result<bool>> ValidateRefreshToken(string? refreshToken)
    {
        if (refreshToken == null)
            return Result<bool>.Failed(ErrorCode.Unauthorized, "Refresh token doesnt exist");
        
        var token =  await _tokenRepository.GetRefreshTokenAsync(TokenHasher.Hash(refreshToken));
        if (token == null)
            return Result<bool>.Failed(ErrorCode.Unauthorized, "Refresh token doesnt exist");

        if (token.IsExpired)
        {
            await _tokenRepository.DeleteRefreshTokenAsync(token.Token);
            return Result<bool>.Failed(ErrorCode.Unauthorized, "Refresh token expired");
        }
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<TokenDTO>> RefreshTokensAsync(string oldRefreshToken)
    {
        var oldToken = await _tokenRepository.GetRefreshTokenAsync(TokenHasher.Hash(oldRefreshToken));

        if(oldToken == null)
            return  Result<TokenDTO>.Failed(ErrorCode.Unauthorized, "Refresh token doesnt exist");

        if (oldToken.IsUsed)
        {
            await _tokenRepository.DeleteUserRefreshTokensAsync(oldToken.User.Id);
            return Result<TokenDTO>.Failed(ErrorCode.Unauthorized, "Refresh token reuse detected");
        }

        if (oldToken.IsExpired)
        {
            await _tokenRepository.DeleteRefreshTokenAsync(oldToken.Token);
            return Result<TokenDTO>.Failed(ErrorCode.Unauthorized, "Refresh token expired");
        }

        var user = await _userManager.FindByIdAsync(oldToken.User.Id.ToString());
        if(user == null)
            return Result<TokenDTO>.Failed(ErrorCode.NotFound, "User not found");

        oldToken.IsUsed = true;
        await _tokenRepository.UpdateRefreshTokenAsync(oldToken);

        var rawRefreshToken = Guid.NewGuid().ToString();
        var refreshToken = new RefreshToken()
        {
            Id = Guid.NewGuid().ToString(),
            Token = TokenHasher.Hash(rawRefreshToken),
            Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDays),
            User = user
        };

        await _tokenRepository.CreateRefreshTokenAsync(refreshToken);

        var accessToken = await GenerateAccessTokenAsync(user);
        if (!accessToken.Succeeded)
            return Result<TokenDTO>.Failed(accessToken.Code, accessToken.ErrorMessages!);

        return Result<TokenDTO>.Success(new TokenDTO
        {
            RefreshToken =  rawRefreshToken,
            AccessToken = accessToken.Data!
        });
    }

    public async Task<Result<string>> GenerateRefreshTokenAsync(User user)
    {
        var rawToken = Guid.NewGuid().ToString();
        var token = new RefreshToken()
        {
            Id = Guid.NewGuid().ToString(),
            Token = TokenHasher.Hash(rawToken),
            Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDays),
            User =  user
        };

        await _tokenRepository.CreateRefreshTokenAsync(token);

        return Result<string>.Success(rawToken);
    }

    public async Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await _tokenRepository.DeleteRefreshTokenAsync(TokenHasher.Hash(refreshToken));

        if (!token)
            return Result<bool>.Failed(ErrorCode.Unauthorized, "Refresh token doesnt exist");
        
        return Result<bool>.Success(token);
    }

    public async Task<Result<string>> RevokeRefreshTokenByUIdAsync(Guid userId)
    {
        await _tokenRepository.DeleteUserRefreshTokensAsync(userId);
        return Result<string>.Success("token has been revoked");
    }

    public async Task CleanupStaleRefreshTokensAsync()
    {
        await _tokenRepository.DeleteStaleRefreshTokensAsync();
    }
}