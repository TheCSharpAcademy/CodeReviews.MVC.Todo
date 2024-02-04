using Microsoft.EntityFrameworkCore;
using MVC.Todo.K_MYR.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServer")));
builder.Services.AddControllers().AddNewtonsoftJson();

var app = builder.Build();

using (var scope = app.Services.CreateScope()) 
{
    var db = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

    if (builder.Configuration.GetValue<bool>("Auto-Migrate"))
        db.Database.Migrate();
    if (builder.Configuration.GetValue<bool>("SeedData"))
        SeedData.Initialize(db);
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
