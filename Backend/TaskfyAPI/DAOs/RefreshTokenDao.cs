using Backend.Data;
using Backend.Models;
using Task = System.Threading.Tasks.Task;

namespace Backend.DAOs
{
    public class RefreshTokenDao
    {
        private readonly ApplicationDbContext _context;

        protected RefreshTokenDao(ApplicationDbContext context)
        {
            _context = context;
        }

        protected async Task<int> Insert(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            return refreshToken.Id;
        }

        protected Task<bool> IsValid(string token)
        {
            RefreshToken? storedToken = _context.RefreshTokens.SingleOrDefault(t => t.Token == token);
            return Task.FromResult(storedToken?.IsExpired ?? false);
        }
    }
}
