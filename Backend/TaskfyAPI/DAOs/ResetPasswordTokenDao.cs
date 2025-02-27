using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace Backend.DAOs
{
    public class ResetPasswordTokenDao
    {
        private readonly ApplicationDbContext _context;

        protected ResetPasswordTokenDao(ApplicationDbContext context)
        {
            _context = context;
        }

        protected async Task<int> Insert(ResetPasswordToken resetPasswordToken)
        {
            _context.ResetPasswordTokens.Add(resetPasswordToken);
            await _context.SaveChangesAsync();
            return resetPasswordToken.Id;
        }

        protected async Task<ResetPasswordToken?> GetByToken(string token)
        {
            ResetPasswordToken? storedToken = await _context.ResetPasswordTokens.Where(t => t.Token == token).SingleOrDefaultAsync();
            return storedToken;
        }

        protected Task<bool> IsValid(string token)
        {
            ResetPasswordToken? storedToken = _context.ResetPasswordTokens.SingleOrDefault(t => t.Token == token);

            if (storedToken == null || storedToken.IsExpired)
            {
                return Task.FromResult(false);
            }
            
            return Task.FromResult(true);
        }

        protected async Task<int> DeleteOldTokens(int userId)
        {
            await _context.ResetPasswordTokens.Where(t => t.UserId == userId).ExecuteDeleteAsync();
            return await _context.SaveChangesAsync();
        }
    }
}
