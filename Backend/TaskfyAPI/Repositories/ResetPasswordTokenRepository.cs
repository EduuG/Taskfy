using Backend.DAOs;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Repositories
{
    public class ResetPasswordTokenRepository : ResetPasswordTokenDao
    {
        public ResetPasswordTokenRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<int> Insert(ResetPasswordToken token)
        {
            try
            {
                return await base.Insert(token);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao inserir token: {ex.Message}", ex);
            }
        }

        public async Task<ResetPasswordToken?> GetByToken(string token)
        {
            ResetPasswordToken? tokenStored = await base.GetByToken(token);

            if (tokenStored == null)
            {
                throw new Exception($"Token não encontrado.");
            }
            
            return tokenStored;
        }

        public async Task<bool> IsValid(string token)
        {
            try
            {
                await GetByToken(token);
                return await base.IsValid(token);
            }
            catch
            {
                return false;
            }
        }

        public async Task<int> DeleteOldTokens(int userId)
        {
            try
            {
                return await base.DeleteOldTokens(userId);
            }
            catch
            {
                throw new Exception($"Erro ao deletar tokens.");
            }
        }
    }
}