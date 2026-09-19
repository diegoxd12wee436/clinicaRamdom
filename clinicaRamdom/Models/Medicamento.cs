namespace clinicaRamdom.Models
{
    public class Medicamento
    {
        public int RecetaId { get; set; }         // 🔗 a qué receta pertenece
        public Receta? Receta { get; set; }



        public int Id { get; set; }
        public string Name { get; set; }

        public string? Descripcion { get; set; } //ahi va frecuencia dias  y todo 
        public string? Dosis { get; set; }
        
        //Constructor
        public Medicamento(int id ,string name, string descripcion ,string dosis, int recetaid)
        {
            Id = id;
            RecetaId = recetaid;
            Name = name;
            Descripcion = descripcion;
            Dosis = dosis;
        }
    }
}
