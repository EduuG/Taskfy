using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
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
        var secretKey = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credenciais = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(Convert.ToInt32(_configuration["Jwt:ExpireHours"]));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
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
            await _resetPasswordTokenRepository.DeleteOldTokens(user.Id); // Delete previous tokens when generating a new one

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