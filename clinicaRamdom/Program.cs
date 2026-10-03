using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using clinicaRamdom.Data;

var builder = WebApplication.CreateBuilder(args);

//anadir la DB
builder.Services.AddDbContext<ClinicaDB>(db => db.UseSqlite(builder.Configuration.GetConnectionString("ClinicaDb")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Sirve la carpeta FrontEnd (hermana de este proyecto) como sitio estático,
// para que el JS llame a /api/... en el MISMO origen y no haya problemas de CORS.
var frontendPath = Path.Combine(builder.Environment.ContentRootPath, "..", "FrontEnd");
var frontendProvider = new PhysicalFileProvider(frontendPath);
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = frontendProvider });
app.UseStaticFiles(new StaticFileOptions { FileProvider = frontendProvider });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
  
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();