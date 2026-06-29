namespace DataAccessLayer.Interfaces;

public interface ITokenRepository
{
    public Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken);
    public Task<bool> CreateRefreshTokenAsync(RefreshToken refreshToken);
    public Task<bool> DeleteRefreshTokenAsync(string refreshToken);
    public Task<bool> DeleteUserRefreshTokensAsync(Guid userId);
    
}