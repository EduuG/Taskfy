namespace Backend.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpirationDate { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public bool IsExpired => DateTime.UtcNow >= ExpirationDate;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}

