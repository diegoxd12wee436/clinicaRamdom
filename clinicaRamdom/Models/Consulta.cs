namespace clinicaRamdom.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public DateTimeOffset Fecha { get; set; }

        public int PacienteId { get; set; }
        public Paciente Paciente { get; set; } = null!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public string Estado { get; set; } = "programada";
        public string? Motivo { get; set; }
    }
}