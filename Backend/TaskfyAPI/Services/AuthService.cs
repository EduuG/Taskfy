using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Backend.DAOs;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using ResetPasswordToken = Backend.Models.ResetPasswordToken;

namespace Backend.Services;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly UserRepository _userRepository;
    private readonly RefreshTokenRepository _refreshTokenRepository;
    private readonly ResetPasswordTokenRepository _resetPasswordTokenRepository;

    public AuthService(IConfiguration configuration, UserRepository userRepository,
        RefreshTokenRepository refreshTokenRepository, ResetPasswordTokenRepository resetPasswordTokenRepository)
    {
        _configuration = configuration;
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _resetPasswordTokenRepository = resetPasswordTokenRepository;
    }

    public async Task<TokensDto> Login(User user)
    {
        TokensDto tokens = new TokensDto()
        {
            AccessToken = GenerateAccessToken(user),
            RefreshToken = await GenerateRefreshToken(user),
        };

        return tokens;
    }

    public async Task<User?> ValidateCredentials(UserDto user)
    {
        User? usuarioExistente = await _userRepository.GetByEmail(user.Email);

        if (usuarioExistente == null || !BCrypt.Net.BCrypt.Verify(user.Password, usuarioExistente.PasswordHash))
        {
            return null;
        }

        return usuarioExistente;
    }


    public string GenerateAccessToken(User user)
    {
        var chaveSecreta = _configuration["Jwt:Key"];
        var emissor = _configuration["Jwt:Issuer"];
        var destinarario = _configuration["Jwt:Audience"];

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
        var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);
        var expiracao = DateTime.UtcNow.AddHours(Convert.ToInt32(_configuration["Jwt:ExpireHours"]));

        var token = new JwtSecurityToken(
            issuer: emissor,
            audience: destinarario,
            claims: claims,
            expires: expiracao,
            signingCredentials: credenciais
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateRefreshToken(User user)
    {
        var randomNumber = new byte[64];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);

            RefreshToken refreshToken = new RefreshToken()
            {
                Token = Convert.ToBase64String(randomNumber),
                User = user,
                UserId = user.Id,
                ExpirationDate = DateTime.UtcNow.AddDays(7),
            };

            await _refreshTokenRepository.Insert(refreshToken);
            return refreshToken.Token;
        }
    }

    public async Task<string> GenerateResetPasswordToken(User user)
    {
        try
        {
            await _resetPasswordTokenRepository.DeleteOldTokens(user.Id); // Deleta tokens anteriores ao gerar um novo

            var randomNumber = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);

                ResetPasswordToken resetPasswordToken = new ResetPasswordToken()
                {
                    Token = Convert.ToBase64String(randomNumber),
                    User = user,
                    UserId = user.Id,
                    ExpirationDate = DateTime.UtcNow.AddMinutes(20),
                };

                await _resetPasswordTokenRepository.Insert(resetPasswordToken);

                byte[] tokenBytes = Encoding.UTF8.GetBytes(resetPasswordToken.Token);
                string tokenEncoded = WebEncoders.Base64UrlEncode(tokenBytes);

                return tokenEncoded;
            }
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
}