using DataAccessLayer.Data;
using DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repository;

public class TokenRepository : ITokenRepository
{
    private readonly AppDbContext _context;
    
    public TokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsTokenExistAsync(string userId) => await _context.RefreshTokens
            .AnyAsync(t => t.User.Id.ToString() == userId);

    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            return null;

        var result = await _context.RefreshTokens
            .Include(t => t.User)
            .Where(t => t.Token == refreshToken)
            .FirstOrDefaultAsync();

        return result;
    }

    public async Task<bool> CreateRefreshTokenAsync(RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
        return true;
    }
    
    

    public async Task<bool> DeleteRefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            return false;
        
        var token = await GetRefreshTokenAsync(refreshToken);
        if(token == null)
            return false;
        
        _context.RefreshTokens.Remove(token);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserRefreshTokenSAsync(string userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(u => u.User.Id.ToString() == userId)
            .ToListAsync<RefreshToken>();
        
        if (tokens.Count == 0)
            return true;
        
        _context.RefreshTokens.RemoveRange(tokens);
        await _context.SaveChangesAsync();
        return true;
    }
}