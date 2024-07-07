using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi;
using TodoApi.Database;
using TodoApi.Models;

var app = Setup.CreateBootstrappedWebApplication();

if (app is null)
{
    Console.WriteLine("App could not start. Exiting...");
    Environment.Exit(1);
}

var todos = app.MapGroup("/todos");

todos.MapPost("/", async Task<Created<Todo>> (TodoCreateDto todoCreateDto, TodoDb db) =>
{
    var todo = new Todo { Name = todoCreateDto.Name, DueAt = todoCreateDto.DueAt, IsComplete = todoCreateDto.IsComplete };
    db.Todos.Add(todo);
    await db.SaveChangesAsync();
    return TypedResults.Created($"/todos/{todo.Id}", todo);
});

todos.MapGet("/", async Task<Ok<List<Todo>>> (TodoDb db) =>
    TypedResults.Ok(
        await db.Todos.OrderBy(t => t.IsComplete).ToListAsync()
    )
);

todos.MapGet("/{id}", async Task<Results<Ok<Todo>, NotFound>> (int id, TodoDb db) =>
    await db.Todos.FindAsync(id) is Todo todo ?
        TypedResults.Ok(todo) :
        TypedResults.NotFound()
);

todos.MapPut("/{id}", async Task<Results<Ok<Todo>, BadRequest, NotFound>> (int id, Todo updateTodo, TodoDb db) =>
{
    if (id != updateTodo.Id)
    {
        return TypedResults.BadRequest();
    }

    var existingTodo = await db.Todos.FindAsync(id);
    if (existingTodo is null)
    {
        return TypedResults.NotFound();
    }

    existingTodo.Name = updateTodo.Name;
    existingTodo.DueAt = updateTodo.DueAt;
    existingTodo.IsComplete = updateTodo.IsComplete;

    db.Todos.Update(existingTodo);
    await db.SaveChangesAsync();

    return TypedResults.Ok(existingTodo);
});

todos.MapDelete("/{id}", async Task<Results<NoContent, NotFound>> (int id, TodoDb db) =>
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null)
        {
            return TypedResults.NotFound();
        }

        db.Remove(todo);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }
);

app.Run();
