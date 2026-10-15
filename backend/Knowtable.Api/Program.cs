using Knowtable.Api.Services;
using Knowtable.Api.Storage;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IProjectStorage, FileProjectStorage>();
builder.Services.AddSingleton<ICardStorage, FileCardStorage>();
builder.Services.AddScoped<StorageOrchestrator>();
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
