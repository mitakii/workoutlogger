using DataAccessLayer.Entities;

namespace DataAccessLayer;

public class RefreshToken
{
    public string Id { get; set; }
    public string Token { get; set; }
    public User User { get; set; }
    public DateTime Expires { get; set; }
    
    public bool IsExpired => DateTime.UtcNow > Expires;
}