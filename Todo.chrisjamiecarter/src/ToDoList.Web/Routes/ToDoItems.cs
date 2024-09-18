using Microsoft.EntityFrameworkCore;
using ToDoList.Web.Data;
using ToDoList.Web.Models;

namespace ToDoList.Web.Routes;

/// <summary>
/// Provides extension methods to map endpoints for ToDoItem operations in the ToDoList application.
/// This static class defines routes for CRUD operations on ToDoItem entities.
/// </summary>
/// <remarks>
/// The MapToDoItemsEndpoints method sets up the routes for getting all to-do items, getting completed to-do items,
/// retrieving a specific to-do item by ID, creating a new to-do item, updating an existing to-do item, and deleting a to-do item.
/// Each route is mapped to a corresponding private static method that handles the request.
/// </remarks>
public static class ToDoItems
{
    public static WebApplication MapToDoItemsEndpoints(this WebApplication app)
    {
        var builder = app.MapGroup("/todoitems");

        builder.MapGet("/", GetAllTodos);
        builder.MapGet("/complete", GetAllCompleteTodos);
        builder.MapGet("/{id}", GetTodo);
        builder.MapPost("/", CreateTodo);
        builder.MapPut("/{id}", UpdateTodo);
        builder.MapDelete("/{id}", DeleteTodo);

        return app;
    }

    private static async Task<IResult> GetAllTodos(ToDoListDataContext context)
    {
        return TypedResults.Ok(await context.ToDoItem.Select(x => new ToDoItemDto(x)).ToListAsync());
    }

    private static async Task<IResult> GetAllCompleteTodos(ToDoListDataContext context)
    {
        return TypedResults.Ok(await context.ToDoItem.Where(t => t.IsComplete).Select(x => new ToDoItemDto(x)).ToListAsync());
    }

    private static async Task<IResult> GetTodo(Guid id, ToDoListDataContext context)
    {
        return await context.ToDoItem.FindAsync(id)
            is ToDoItem toDoItem
            ? TypedResults.Ok(new ToDoItemDto(toDoItem))
            : TypedResults.NotFound();
    }

    private static async Task<IResult> CreateTodo(ToDoItemDto toDoItemDto, ToDoListDataContext context)
    {
        toDoItemDto.Id = Guid.NewGuid();

        var toDoItem = new ToDoItem
        {
            Id = toDoItemDto.Id,
            Name = toDoItemDto.Name,
            IsComplete = toDoItemDto.IsComplete,
        };

        context.ToDoItem.Add(toDoItem);
        await context.SaveChangesAsync();

        return TypedResults.Created($"/todoitems/{toDoItem.Id}", toDoItemDto);
    }

    private static async Task<IResult> UpdateTodo(Guid id, ToDoItemDto toDoItemDto, ToDoListDataContext context)
    {
        var toDoItem = await context.ToDoItem.FindAsync(id);
        if (toDoItem is null)
        {
            return TypedResults.NotFound();
        }

        toDoItem.Name = toDoItemDto.Name;
        toDoItem.IsComplete = toDoItemDto.IsComplete;

        await context.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static async Task<IResult> DeleteTodo(Guid id, ToDoListDataContext context)
    {
        if (await context.ToDoItem.FindAsync(id) is ToDoItem toDoItem)
        {
            context.ToDoItem.Remove(toDoItem);
            await context.SaveChangesAsync();

            return TypedResults.NoContent();
        }

        return TypedResults.NotFound();
    }
}
