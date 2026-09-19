using System;
using System.Collections.Generic;
namespace clinicaRamdom.Models
{
    public class Paciente
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Cedula { get; set; }
        public string AlergiasConocidas { get; set; }
        public string Numero { get; set; }
        public string Email { get; set; }
        public DateOnly FechaNacimiento { get; set; }

        public List<Consulta> Consultas { get; set; } = new(); //basicamente si no le dan nada pues comienza vacia


        //constructor
        public Paciente(int id, string name, string cedula, string alergiaConocidas, string num, string email, DateOnly fechaNac)
        {
            Id = id;
            Name = name;
            Cedula = cedula;
            AlergiasConocidas = alergiaConocidas;
            Numero = num;
            Email = email;
            FechaNacimiento = fechaNac;
        }
    }
}