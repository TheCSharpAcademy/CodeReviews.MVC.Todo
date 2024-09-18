using Microsoft.EntityFrameworkCore;
using ToDoList.Web.Data;
using ToDoList.Web.Routes;

namespace ToDoList.Web;

/// <summary>
/// The entry point for the ToDoList web application.
/// This class configures and starts the web application, setting up services and middleware.
/// </summary>
/// <remarks>
/// The Main method creates a WebApplicationBuilder, configures services including the database context,
/// and builds the application. It sets up middleware for serving static files, HTTPS redirection,
/// and maps the endpoints for ToDoItem operations.
/// </remarks>
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.WriteIndented = true;
        });

        builder.Services.AddDbContext<ToDoListDataContext>(options =>
        {
            options.UseInMemoryDatabase("ToDoList");
        });

        builder.Services.AddDatabaseDeveloperPageExceptionFilter();

        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseHttpsRedirection();

        app.MapToDoItemsEndpoints();

        app.Run();
    }
}
