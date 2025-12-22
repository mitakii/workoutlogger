using BusinessLayer.Exceptions;

namespace BusinessLayer.Interfaces;

public interface ITokenService
{
    public Task<Result<string>> CreateTokenAsync(string userId);
}