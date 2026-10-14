using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace clinicaRamdom.Migrations
{
    /// <inheritdoc />
    public partial class AgregarEstadoMotivoConsulta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Consultas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Motivo",
                table: "Consultas",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "Motivo",
                table: "Consultas");
        }
    }
}
