using clinicaRamdom.Data;
using clinicaRamdom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace clinicaRamdom.Controllers
{
    public class ConsultaDto
    {
        public DateTimeOffset Fecha { get; set; }
        public int PacienteId { get; set; }
        public int DoctorId { get; set; }
        public string? Estado { get; set; }
        public string? Motivo { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ConsultasController : ControllerBase
    {
        private readonly ClinicaDB _db;

        private static readonly string[] EstadosValidos =
            { "programada", "espera", "consulta", "atendida", "cancelada", "no-asistio" };

        public ConsultasController(ClinicaDB db)
        {
            _db = db;
        }

        // GET api/consultas -> todas las citas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _db.Consultas
                .Select(c => new
                {
                    c.Id,
                    c.Fecha,
                    c.Estado,
                    c.Motivo,
                    c.PacienteId,
                    PacienteNombre = c.Paciente.Name,
                    c.DoctorId,
                    DoctorNombre = c.Doctor.Name
                })
                .ToListAsync();

            // SQLite no ordena por DateTimeOffset: se ordena en memoria
            return Ok(lista.OrderBy(c => c.Fecha).ToList());
        }
        // GET api/consultas/5 -> una cita
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cita = await _db.Consultas
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Fecha,
                    c.Estado,
                    c.Motivo,
                    c.PacienteId,
                    PacienteNombre = c.Paciente.Name,
                    c.DoctorId,
                    DoctorNombre = c.Doctor.Name
                })
                .FirstOrDefaultAsync();
            if (cita == null) return NotFound();
            return Ok(cita);
        }

        // POST api/consultas -> crear cita
        [HttpPost]
        public async Task<IActionResult> Create(ConsultaDto dto)
        {
            var error = await Validar(dto);
            if (error != null) return BadRequest(error);

            var consulta = new Consulta
            {
                Fecha = dto.Fecha,
                PacienteId = dto.PacienteId,
                DoctorId = dto.DoctorId,
                Estado = dto.Estado ?? "programada",
                Motivo = dto.Motivo
            };
            _db.Consultas.Add(consulta);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = consulta.Id }, new { consulta.Id });
        }

        // PUT api/consultas/5 -> editar cita
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ConsultaDto dto)
        {
            var consulta = await _db.Consultas.FindAsync(id);
            if (consulta == null) return NotFound();

            var error = await Validar(dto);
            if (error != null) return BadRequest(error);

            consulta.Fecha = dto.Fecha;
            consulta.PacienteId = dto.PacienteId;
            consulta.DoctorId = dto.DoctorId;
            consulta.Estado = dto.Estado ?? consulta.Estado;
            consulta.Motivo = dto.Motivo;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/consultas/5 -> borrar cita
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var consulta = await _db.Consultas.FindAsync(id);
            if (consulta == null) return NotFound();

            _db.Consultas.Remove(consulta);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string?> Validar(ConsultaDto dto)
        {
            if (dto.Estado != null && !EstadosValidos.Contains(dto.Estado))
                return "Estado no válido.";
            if (!await _db.Pacientes.AnyAsync(p => p.Id == dto.PacienteId))
                return "El paciente no existe.";
            if (!await _db.Doctores.AnyAsync(d => d.Id == dto.DoctorId))
                return "El doctor no existe.";
            return null;
        }
    }
}