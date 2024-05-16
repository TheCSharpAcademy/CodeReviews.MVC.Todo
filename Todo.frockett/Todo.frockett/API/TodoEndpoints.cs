using Microsoft.EntityFrameworkCore;
using Todo.frockett.Data;
using Todo.frockett.Models;

namespace Todo.frockett.API;

public class TodoEndpoints
{
    // Referenced https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/route-handlers?view=aspnetcore-8.0#endpoint-defined-outside-of-programcs

    public static void Map(WebApplication app)
    {
        // Minimal API Endpoints
        app.MapGet("/todoitems", async (TodoContext context) =>
            await context.TodoItems.ToListAsync());

        app.MapGet("/todoitems/complete", async (TodoContext context) =>
            await context.TodoItems.Where(t => t.IsComplete == true).ToListAsync());

        app.MapGet("/todoitems/{id}", async (int id, TodoContext context) =>

            await context.TodoItems.FindAsync(id)
                is TodoItem item
                    ? Results.Ok(item)
                    : Results.NotFound());

        app.MapPost("/todoitems", async (TodoItem item, TodoContext context) =>
        {
            context.TodoItems.Add(item);
            await context.SaveChangesAsync();

            return Results.Created($"/todoitems/{item.Id}", item);
        });

        app.MapPut("/todoitems/{id}", async (int id, TodoItem inputTodo, TodoContext context) =>
        {
            var item = await context.TodoItems.FindAsync(id);

            if (item is null) return Results.NotFound();

            item.Name = inputTodo.Name;
            item.IsComplete = inputTodo.IsComplete;

            await context.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapDelete("/todoitems/{id}", async (int id, TodoContext context) =>
        {
            if (await context.TodoItems.FindAsync(id) is TodoItem todo)
            {
                context.TodoItems.Remove(todo);
                await context.SaveChangesAsync();
                return Results.NoContent();
            }

            return Results.NotFound();
        });
    }

}
