using MongoDB.Driver;
using ThreadWars.Models;
using ThreadWars.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpLogging(o => { });
builder.Services.Configure<ThreadDatabaseSettings>(
builder.Configuration.GetSection("ThreadDatabase"));

MongoDbConfig.RegisterSerializers(
    new MongoClient(
        builder.Configuration.GetSection("ThreadDatabase:Host").Value
    ).GetDatabase(
        builder.Configuration.GetSection("ThreadDatabase:DatabaseName").Value
    )
);

builder.Services.AddSingleton<IThreadService, ThreadService>();

builder.Services.AddControllers();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpLogging();

app.MapControllers();
//app.UseHttpsRedirection();

app.Run();
