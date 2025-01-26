using Microsoft.EntityFrameworkCore;
using Todo.TwilightSaw.Data;
using Todo.TwilightSaw.Repository;
using Todo.TwilightSaw.Service;

namespace Todo.TwilightSaw.Factory;

public class HostFactory
{
    public static WebApplication CreateWebApplication(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var configuration = builder.Configuration;

        var services = builder.Services;

        services.AddDbContext<AppDbContext>(options => options
            .UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
            .LogTo(Console.WriteLine, LogLevel.None)
            .UseLazyLoadingProxies());

        services.AddControllersWithViews();
        services.AddRouting();
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddScoped<DbContext, AppDbContext>();
        services.AddScoped<IRepository<Models.Todo>, TodoRepository<Models.Todo>>();
        services.AddScoped<TodoService>();

        return builder.Build();
    }
}