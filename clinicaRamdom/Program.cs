using Microsoft.EntityFrameworkCore;
using clinicaRamdom.Data;

var builder = WebApplication.CreateBuilder(args);

//anadir la DB
builder.Services.AddDbContext<ClinicaDB>(db => db.UseSqlite(builder.Configuration.GetConnectionString("ClinicaDb")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
