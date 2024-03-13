using Microsoft.EntityFrameworkCore;
using TodoList.Doc415.Data;
using TodoList.Doc415.Models;

namespace TodoList.Doc415.Repository;

public class TodoRepositoty
{

    private readonly IDbContextFactory<TodoDb> _contextFactory;
    public TodoRepositoty(IDbContextFactory<TodoDb> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<List<Todo>> GetAllTodos()
    {
        using var context = _contextFactory.CreateDbContext();
        return await context.Todos.ToListAsync();
    }

    public async Task DeleteTodo(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var todo = await context.Todos.SingleOrDefaultAsync(x => x.Id == id);
        context.Todos.Remove(todo);
        await context.SaveChangesAsync();
    }

    public async Task UpdateTodo(int id, Todo inputTodo)
    {
        using var context = _contextFactory.CreateDbContext();
        var todoToUpdate = await context.Todos.SingleOrDefaultAsync(x => x.Id == id);
        todoToUpdate.Name = inputTodo.Name;
        todoToUpdate.IsCompleted = inputTodo.IsCompleted;
        context.Update(todoToUpdate);
        await context.SaveChangesAsync();
    }

    public async Task AddTodo(Todo inputTodo)
    {
        using var context = _contextFactory.CreateDbContext();
        await context.AddAsync(inputTodo);
        await context.SaveChangesAsync();
    }
}
