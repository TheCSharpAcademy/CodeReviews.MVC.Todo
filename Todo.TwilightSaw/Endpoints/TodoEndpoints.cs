using System.Collections.Generic;
using Todo.TwilightSaw.Service;

namespace Todo.TwilightSaw.Endpoints;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(WebApplication app)
    {
        app.MapGet("/todoLists", (TodoService todoService) => todoService.GetTodos());

        app.MapGet("/todoList/{id}", (int id, TodoService todoService) =>
        {
            var list = todoService.GetTodo(id);
            return list is not null ? Results.Ok(list) : Results.NotFound();
        });

        app.MapPost("/todoList", (Models.Todo todo,TodoService todoService) =>
        {
            todoService.AddTodo(todo);
            return Results.Created($"/todoList/{todo.Id}", todo);
        });

        app.MapPut("/todoList/{id}", (Models.Todo todo, int id, TodoService todoService) =>
        {
            var list = todoService.GetTodo(id);
            if (list == null) return Results.NotFound();
            list.IsCompleted = todo.IsCompleted;
            list.Name = todo.Name;
            todoService.UpdateTodo(list);
            return Results.Ok(list);
        });

        app.MapDelete("/todoList/{id}", (int id, TodoService todoService) =>
        {
            var list = todoService.GetTodo(id);
            if (list == null) return Results.NotFound();
            todoService.DeleteTodo(id);
            return Results.Ok();
        });
    }
}