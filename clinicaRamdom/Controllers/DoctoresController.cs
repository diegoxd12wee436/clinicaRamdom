using clinicaRamdom.Data;
using clinicaRamdom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace clinicaRamdom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctoresController : ControllerBase
    {
        private readonly ClinicaDB _db;

        public DoctoresController(ClinicaDB db)
        {
            _db = db;
        }

        // GET api/doctores -> lista de doctores
        [HttpGet]
        public async Task<ActionResult<List<Doctor>>> GetAll()
        {
            return await _db.Doctores.ToListAsync();
        }

        // GET api/doctores/5 -> un doctor
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetById(int id)
        {
            var doctor = await _db.Doctores.FindAsync(id);
            if (doctor == null) return NotFound();
            return doctor;
        }

        // POST api/doctores -> crear
        [HttpPost]
        public async Task<ActionResult<Doctor>> Create(Doctor doctor)
        {
            doctor.Id = 0;
            _db.Doctores.Add(doctor);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
        }

        // PUT api/doctores/5 -> editar
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Doctor datos)
        {
            var doctor = await _db.Doctores.FindAsync(id);
            if (doctor == null) return NotFound();

            doctor.Name = datos.Name;
            doctor.Especialidad = datos.Especialidad;
            doctor.Numero = datos.Numero;
            doctor.IsEstudent = datos.IsEstudent;
            doctor.Email = datos.Email;
            doctor.Cedula = datos.Cedula;
            doctor.ColorHex = datos.ColorHex;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/doctores/5 -> borrar
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _db.Doctores.FindAsync(id);
            if (doctor == null) return NotFound();

            _db.Doctores.Remove(doctor);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}