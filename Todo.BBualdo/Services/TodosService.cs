using Microsoft.AspNetCore.Http.HttpResults;
using Todo.Models;

namespace Todo.Services;

public class TodosService(ITodosRepository repository) : ITodosService
{
    private readonly ITodosRepository _repository = repository;
    public async Task<IResult> GetTodos()
    {
        var todos = await _repository.GetTodosAsync();
        return Results.Ok(todos);
    }

    public async Task<IResult> AddTodo(TodoItem todo)
    {
        await _repository.AddTodoAsync(todo);
        return Results.Created("todo", todo);
    }

    public async Task<IResult> ToggleTodoCompleted(int id)
    {
        await _repository.ToggleCompleteAsync(id);
        return Results.NoContent();
    }

    public async Task<IResult> DeleteTodo(int id)
    {
        await _repository.DeleteTodoAsync(id);
        return Results.NoContent();
    }

    public async Task<IResult> DeleteCompletedTodos()
    {
        await _repository.DeleteCompletedTodosAsync();
        return Results.NoContent();
    }
}