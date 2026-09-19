namespace clinicaRamdom.Models
{
    public class Diagnostico
    {
        //las consulta la relacion a que pertence
        public int Id { get; set; }
        public int Id_consulta { get; set; }
        public Consulta? Consulta { get; set; }

        //ahora lo importante
        public string? CodigoCIE10 { get; set; } //es el formato de identificacion de enfermedades usado por medicos
        public string? Descripcion { get; set; }
        public string? Observaciones { get; set; }

        public DateTimeOffset Fecha { get; set; }

        public Diagnostico(int id , Consulta con , string code ,string desc, string obs, DateTimeOffset fecha)
        {
            Id_consulta = id;
            Consulta = con;
            CodigoCIE10 = code;
            Descripcion = desc;
            Observaciones = obs;
            Fecha = fecha;
        }


    }
}
