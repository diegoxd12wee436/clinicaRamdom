using clinicaRamdom.Data;
using clinicaRamdom.Models;
using clinicaRamdom.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace clinicaRamdom.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly ClinicaDB _db;
        private readonly IWebHostEnvironment _env;

        public AuthController(ClinicaDB db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new AuthResponseDto { Success = false, Message = "Todos los campos son obligatorios." });
            }

            if (request.Password.Length < 6)
            {
                return BadRequest(new AuthResponseDto { Success = false, Message = "La contraseña debe tener al menos 6 caracteres." });
            }

            var existe = await _db.Usuarios.AnyAsync(u => u.Email == request.Email);
            if (existe)
            {
                return Conflict(new AuthResponseDto { Success = false, Message = "Ya existe una cuenta con ese correo." });
            }

            var usuario = new Usuario(request.Nombre, request.Email, Hash(request.Password));
            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();

            return Ok(new AuthResponseDto { Success = true, Message = "Cuenta creada correctamente." });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponseDto { Success = false, Message = "Correo y contraseña son obligatorios." });
            }

            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario is null || usuario.PasswordHash != Hash(request.Password))
            {
                return Unauthorized(new LoginResponseDto { Success = false, Message = "Correo o contraseña incorrectos." });
            }

            return Ok(new LoginResponseDto
            {
                Success = true,
                Message = "Login exitoso.",
                Nombre = usuario.Nombre,
                Email = usuario.Email
            });
        }

        // POST /api/auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Respuesta genérica aunque el correo no exista, para no revelar qué
            // correos están registrados en el sistema.
            if (usuario is null)
            {
                return Ok(new AuthResponseDto { Success = true, Message = "Si el correo existe, se envió un código." });
            }

            var codigo = RandomNumberGenerator.GetInt32(0, 100000).ToString("D5");
            usuario.ResetCode = codigo;
            usuario.ResetCodeExpiresAt = DateTime.UtcNow.AddMinutes(10);
            await _db.SaveChangesAsync();

            // TODO: aquí se enviaría el código por correo real (SMTP / SendGrid / etc).
            // Como el proyecto todavía no tiene un servicio de correo configurado,
            // en Development devolvemos el código en la respuesta para poder
            // probar el flujo completo sin bandeja de entrada.
            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = "Código enviado.",
                Code = _env.IsDevelopment() ? codigo : null
            });
        }

        // POST /api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario is null || usuario.ResetCode != request.Code ||
                usuario.ResetCodeExpiresAt is null || usuario.ResetCodeExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new AuthResponseDto { Success = false, Message = "Código inválido o expirado." });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new AuthResponseDto { Success = false, Message = "La nueva contraseña debe tener al menos 6 caracteres." });
            }

            usuario.PasswordHash = Hash(request.NewPassword);
            usuario.ResetCode = null;
            usuario.ResetCodeExpiresAt = null;
            await _db.SaveChangesAsync();

            return Ok(new AuthResponseDto { Success = true, Message = "Contraseña actualizada correctamente." });
        }

        // Hash simple con SHA256. Para producción real conviene BCrypt/Argon2,
        // pero esto ya evita guardar la contraseña en texto plano.
        private static string Hash(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}