using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.DAOs
{
    public class UserDao
    {
        private readonly ApplicationDbContext _context;

        protected UserDao(ApplicationDbContext context)
        {
            _context = context;
        }

        protected async Task<User?> GetById(int id)
        {
            User? user = await _context.Users.FindAsync(id);
            return user;
        }

        protected async Task<List<User>> List(User? filter = null)
        {
            IQueryable<User> query = _context.Users.AsQueryable();

            if (filter != null)
            {
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(x => x.Name.Contains(filter.Name));
                }

                if (!string.IsNullOrEmpty(filter.Email))
                {
                    query = query.Where(u => u.Email == filter.Email);
                }
            }

            return await query.ToListAsync();
        }

        protected async Task<User?> GetByEmail(string email)
        {
            User? user = await _context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();
            return user;
        }

        protected async Task<User?> GetByRefreshToken(string refreshToken)
        {
            return await _context.Users
                .Where(u => u.RefreshTokens.Any(t => t.Token == refreshToken))
                .FirstOrDefaultAsync();
        }

        protected async Task<User> Register(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        protected async Task<int> ResetPassword(User user)
        {
            _context.Users.Update(user);
            return await _context.SaveChangesAsync();
        }
    }
}