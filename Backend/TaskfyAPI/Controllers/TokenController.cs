using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly RefreshTokenRepository _refreshTokenRepository;
        private readonly ResetPasswordTokenRepository _resetPasswordTokenRepository;
        private readonly UserRepository _userRepository;
        private readonly AuthService _authService;

        public TokenController(IConfiguration configuration, RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository, AuthService authService, ResetPasswordTokenRepository resetPasswordTokenRepository)
        {
            _configuration = configuration;
            _refreshTokenRepository = refreshTokenRepository;
            _resetPasswordTokenRepository = resetPasswordTokenRepository;
            _userRepository = userRepository;
            _authService = authService;
        }

        [HttpPost("RefreshToken")] // Endpoint to generate a new access token
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest(new { message = "Refresh token não encontrado." });
                }

                User? user = await _userRepository.GetByRefreshToken(refreshToken);
                if (user == null)
                {
                    return BadRequest(new { message = "Refresh token inválido." });
                }

                bool refreshTokenIsExpired = await _refreshTokenRepository.IsValid(refreshToken);

                if (refreshTokenIsExpired)
                {
                    return BadRequest(new { message = "Sessão expirada." });
                }

                var newAccessToken = _authService.GenerateAccessToken(user);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(7),
                };

                Response.Cookies.Append("token", newAccessToken, cookieOptions);

                return Ok(new { token = newAccessToken });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("ValidateResetPasswordToken")]
        public async Task<IActionResult> ValidateResetPasswordToken([FromQuery] string token)
        {
            try
            {
                byte[] decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
                string decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
                
                bool isValid = await _resetPasswordTokenRepository.IsValid(decodedToken);
                
                return Ok(isValid);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}