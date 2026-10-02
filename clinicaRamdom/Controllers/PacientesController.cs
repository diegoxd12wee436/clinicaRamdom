using clinicaRamdom.Data;
using clinicaRamdom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace clinicaRamdom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly ClinicaDB _db;

        public PacientesController(ClinicaDB db)
        {
            _db = db;
        }

        // GET api/pacientes -> lista de pacientes
        [HttpGet]
        public async Task<ActionResult<List<Paciente>>> GetAll()
        {
            return await _db.Pacientes.Include(p => p.Consultas).ToListAsync();
        }

        // GET api/pacientes/5 -> un paciente
        [HttpGet("{id}")]
        public async Task<ActionResult<Paciente>> GetById(int id)
        {
            var paciente = await _db.Pacientes
                .Include(p => p.Consultas)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (paciente == null) return NotFound();
            return paciente;
        }

        // POST api/pacientes -> crear
        [HttpPost]
        public async Task<ActionResult<Paciente>> Create(Paciente paciente)
        {
            paciente.Id = 0;
            _db.Pacientes.Add(paciente);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = paciente.Id }, paciente);
        }

        // PUT api/pacientes/5 -> editar
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Paciente datos)
        {
            var paciente = await _db.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound();

            paciente.Name = datos.Name;
            paciente.Cedula = datos.Cedula;
            paciente.AlergiasConocidas = datos.AlergiasConocidas;
            paciente.Numero = datos.Numero;
            paciente.Email = datos.Email;
            paciente.FechaNacimiento = datos.FechaNacimiento;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/pacientes/5 -> borrar
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var paciente = await _db.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound();

            _db.Pacientes.Remove(paciente);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}