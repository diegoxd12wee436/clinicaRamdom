namespace clinicaRamdom.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Especialidad { get; set; }
        public string? Numero { get; set; }
        public bool IsEstudent { get; set; } 
        public string? Email { get; set; }
        public string Cedula { get; set; }
        //tambien guardare uncolor para direfenciarlos en la agenda 
        public string ColorHex { get; set; } = "#3498db";


        public Doctor(int id, string name ,string especialidad,string num,bool student ,string? email, string cedula )
        {
            Id = id;
            Name = name;
            Especialidad = especialidad;
            Numero = num;
            IsEstudent = student;
            Email = email;
            Cedula = cedula;
        }
    }
}
