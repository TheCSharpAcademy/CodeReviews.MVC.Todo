using Microsoft.EntityFrameworkCore;
using TodoList.Doc415.Data;
using TodoList.Doc415.Repository;

namespace TodoList.Doc415;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllersWithViews();
        builder.Services.AddDbContextFactory<TodoDb>(
               options => options.UseSqlServer(builder.Configuration.GetConnectionString("TodoDb") ?? throw new InvalidOperationException("Connection string 'TodoDb' not found.")));

        builder.Services.AddScoped<TodoRepositoty>();
        builder.Services.AddEndpointsApiExplorer();
        var app = builder.Build();


        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
