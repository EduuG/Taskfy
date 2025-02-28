using System.Security.Claims;
using System.Text;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserRepository _userRepository;
        private readonly AuthService _authService;
        private readonly RefreshTokenRepository _refreshTokenRepository;
        private readonly ResetPasswordTokenRepository _resetPasswordTokenRepository;
        private readonly EmailService _emailService;
        private readonly ILogger<UserController> _logger;

        public UserController(IConfiguration configuration, UserRepository userRepository, AuthService authService,
            RefreshTokenRepository refreshTokenRepository, ResetPasswordTokenRepository resetPasswordTokenRepository,
            EmailService emailService, ILogger<UserController> logger)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _authService = authService;
            _refreshTokenRepository = refreshTokenRepository;
            _emailService = emailService;
            _resetPasswordTokenRepository = resetPasswordTokenRepository;
            _logger = logger;
        }

        [Authorize]
        [HttpGet("GetData")]
        public IActionResult GetData()
        {
           var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
           var name = User.FindFirstValue(ClaimTypes.Name);
           var email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email))
            {
                return BadRequest();
            }

            return Ok(new { Id = id, Name = name, Email = email });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {
            User? storedUser = await _authService.ValidateCredentials(user);

            if (storedUser != null)
            {
                return BadRequest(new { mensagem = "E-mail já cadastrado." });
            }

            User newUser = await _userRepository.RegisterUser(user);
            return CreatedAtAction(nameof(Register), new { id = newUser.Id }, newUser);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserDto user)
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("E-mail e senha são obrigatórios.");
            }

            User? storedUser = await _authService.ValidateCredentials(user);

            if (storedUser == null)
            {
                return BadRequest(new { mensagem = "E-mail ou senha inválidos." });
            }

            TokensDto tokens = await _authService.Login(storedUser);

            var accessTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(7),
            };

            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7),
            };

            Response.Cookies.Append("token", tokens.AccessToken, accessTokenOptions);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, refreshTokenOptions);

            return Ok(new
            {
                message = "Login bem-sucedido.",
                user = new { Id = storedUser.Id, Name = storedUser.Name, Email = storedUser.Email }
            });
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token");
            Response.Cookies.Delete("refreshToken");

            return Ok(new { message = "Logout bem-sucedido." });
        }

        [HttpGet("GetStatus")]
        public async Task<IActionResult> GetStatus()
        {
            string? refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Ok(false);

            bool refreshTokenIsExpired = await _refreshTokenRepository.IsValid(refreshToken);

            if (refreshTokenIsExpired)
            {
                return Ok(false);
            }

            User? usuario = await _userRepository.GetByRefreshToken(refreshToken);

            if (usuario == null)
                return Ok(false);

            return Ok(true);
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            string baseUrl = _configuration["AppSettings:BaseUrl"];
            User? user = await _userRepository.GetByEmail(request.Email);

            if (user == null)
            {
                return BadRequest("E-mail não encontrado.");
            }

            var encodedToken = await _authService.GenerateResetPasswordToken(user);
            var resetLink = $"{baseUrl}/ResetPassword?token={encodedToken}";

            await _emailService.SendPasswordResetEmail(user.Email, resetLink);

            return Ok("E-mail de recuperação enviado.");
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request,
            [FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token inválido.");
            }
                
            string decodedToken;
            try
            {
                byte[] decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
                decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            }
            catch (Exception)
            {
                return BadRequest("Erro ao decodificar token.");
            }

            ResetPasswordToken? tokenStored = await _resetPasswordTokenRepository.GetByToken(decodedToken);

            if (tokenStored == null || tokenStored.IsExpired)
            {
                return BadRequest("Token expirado ou inválido.");
            }

            await _resetPasswordTokenRepository
                .DeleteOldTokens(tokenStored.UserId); // Delete previous tokens when resetting password
            await _userRepository.ResetPassword(tokenStored.UserId, request.NewPassword);

            return Ok("Senha redefinida com sucesso.");
        }
    }
}