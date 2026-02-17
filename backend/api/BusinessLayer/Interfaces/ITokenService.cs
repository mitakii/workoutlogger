using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLayer.Interfaces;

public interface ITokenService
{
    public Task<Result<string>> GenerateAccessTokenAsync(User user);
    
    public Task<Result<bool>> ValidateRefreshToken(string refreshToken);
    public Task<Result<TokenDTO>> RefreshTokensAsync(string oldRefreshToken);
    public Task<Result<string>> GenerateRefreshTokenAsync(User user);
    public Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken);
    
    public Task<Result<string>> RevokeUserRefreshTokenAsync(string userId);
    
    
}