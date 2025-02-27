namespace Backend.Models;
[Serializable]

public class User
{
    public int Id { get; set; }
    public string Name {get; set;} = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public List<ResetPasswordToken> ResetPasswordTokens { get; set; } = new();
}