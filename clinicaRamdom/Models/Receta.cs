namespace clinicaRamdom.Models
{
    public class Receta
    {
        //el identificador
        public int Id { get; set; }
        public Consulta Consulta { get; set; }

        // las varibles 
        public DateTimeOffset FechaEmision { get; set; }
        public string? DatosGenrales { get; set; } //reposo 3 dias ns etc
        public List<Medicamento> Medicamentos { get; set; } = new();

        public Receta(int id, Consulta consulta, DateTimeOffset fecha, string datosGenrales)
        {
            Id = id;
            Consulta = consulta;
            FechaEmision = fecha;
            DatosGenrales = datosGenrales;
        }
    }
}
