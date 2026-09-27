namespace clinicaRamdom.Models
    {
      public class Usuario
        {
            public int Id { get; set; }
            public string Nombre { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string PasswordHash { get; set; } = string.Empty;

            // Usados por el flujo de "recuperar contraseña"
            public string? ResetCode { get; set; }
            public DateTime? ResetCodeExpiresAt { get; set; }

            public Usuario() { }

            public Usuario(string nombre, string email, string passwordHash)
            {
                Nombre = nombre;
                Email = email;
                PasswordHash = passwordHash;
            }
        }
    }

