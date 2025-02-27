using Backend.DAOs;
using Backend.Data;
using Backend.Models;

namespace Backend.Repositories
{
    public class RefreshTokenRepository : RefreshTokenDao
    {
        public RefreshTokenRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<int> Insert(RefreshToken refreshToken)
        {
            try
            {
                return await base.Insert(refreshToken);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao inserir token: {ex.Message}", ex);
            }
        }

        public async Task<Boolean> IsValid(string refreshToken)
        {
            try
            {
                return await base.IsValid(refreshToken);
            }
            catch
            {
                throw new Exception($"Erro ao obter validade do token: {refreshToken}");
            }
        }
    }
}
