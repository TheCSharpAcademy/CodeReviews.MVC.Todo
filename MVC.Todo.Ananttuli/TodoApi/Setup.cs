using Microsoft.EntityFrameworkCore;
using TodoApi.Database;

namespace TodoApi;

public static class Setup
{
    public static WebApplication? CreateBootstrappedWebApplication()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddDbContext<TodoDb>(opt => opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

        builder.Services.AddEndpointsApiExplorer();

        var swaggerDocTitle = "TodoAPI";
        var apiVersion = "v1";

        builder.Services.AddOpenApiDocument(config =>
        {
            config.DocumentName = swaggerDocTitle;
            config.Version = apiVersion;
            config.Title = $"{config.DocumentName} {config.Version}";
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            scope.ServiceProvider.GetRequiredService<TodoDb>().Database.EnsureCreated();
        }

        app.UseDefaultFiles();
        app.UseStaticFiles();

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi(config =>
            {
                config.DocumentTitle = swaggerDocTitle;
                config.Path = "/swagger";
                config.DocumentPath = "/swagger/{documentName}/swagger.json";
                config.DocExpansion = "list";
            });
        }

        return app;
    }
}