using Microsoft.EntityFrameworkCore;
using clinicaRamdom.Models;

namespace clinicaRamdom.Data
{
    public class ClinicaDB : DbContext
    {
        public ClinicaDB(DbContextOptions<ClinicaDB> db) :base(db) { }
        
        //las clases 
        public DbSet<Consulta> Consultas { get; set; }
        public DbSet<Diagnostico> Diagnosticos { get; set; }
        public DbSet<Doctor> Doctores { get; set; }
        public DbSet<Medicamento> Medicamentos { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Receta> Recetas { get; set; }


    }
}
