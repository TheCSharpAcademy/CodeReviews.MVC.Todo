using Microsoft.EntityFrameworkCore;
using Todo.TwilightSaw.Data;

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

        return builder.Build();
    }
}