namespace BusinessLayer.Services;

public class JwtOptions
{
    public string Issuer  { get; set; }
    public string Audience { get; set; }
    public string SigningKey  { get; set; }
    public int AccessTokenHours { get; set; }
    public int RefreshTokenDays { get; set; }
}