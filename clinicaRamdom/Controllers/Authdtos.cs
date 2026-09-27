namespace clinicaRamdom.Models.Dtos
{
    // -------- Login --------
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Nombre { get; set; }
        public string? Email { get; set; }
    }

    // -------- Registro --------
    public class RegisterRequestDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // -------- Recuperar contraseña --------
    public class ForgotPasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    // -------- Respuesta genérica (registro / forgot-password / reset-password) --------
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

        // Solo se llena en ambiente de Development, para poder probar el flujo
        // de "recuperar contraseña" sin tener un servicio de correo configurado.
        public string? Code { get; set; }
    }
}