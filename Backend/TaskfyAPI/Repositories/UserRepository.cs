using System.Globalization;
using Backend.DAOs;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Repositories
{
    public class UserRepository : UserDao
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<User>> ListUsers(User? filtro = null)
        {
            return await base.List(filtro);
        }

        public async Task<User?> GetById(int id)
        {
            try
            {
                return await base.GetById(id);
            }
            catch (Exception ex)
            {
                throw new SystemException(ex.Message, ex);
            }
        }

        public async Task<User?> GetByEmail(string email)
        {
            try
            {
                return await base.GetByEmail(email);
            }
            catch (Exception ex)
            {
                throw new SystemException(ex.Message, ex);
            }
        }

        public async Task<User?> GetByRefreshToken(string refreshToken)
        {
            return await base.GetByRefreshToken(refreshToken);
        }

        public async Task<User> RegisterUser(UserDto user)
        {
            var formatText = new CultureInfo("pt-BR", false).TextInfo;
            
            try
            {
                User newUser = new User()
                {
                    Email = user.Email,
                    Name = formatText.ToTitleCase(user.Name.ToLower()),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password),
                };

                return await base.Register(newUser);
            }
            catch (Exception ex)
            {
                throw new SystemException(ex.Message, ex);
            }
        }

        public async Task<int> ResetPassword(int userId, string newPassword)
        {
            try
            {
                User? user = await GetById(userId);

                if (user == null)
                {
                    return 0;
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

                return await base.ResetPassword(user);
            }
            catch (Exception ex)
            {
                throw new SystemException(ex.Message, ex);
            }
        }
    }
}