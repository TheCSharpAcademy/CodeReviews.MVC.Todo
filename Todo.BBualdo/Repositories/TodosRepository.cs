using Microsoft.EntityFrameworkCore;
using Todo.Data;
using Todo.Models;
using Todo.Services;

namespace Todo.Repositories;

public class TodosRepository(TodoDbContext dbContext) : ITodosRepository
{
    private readonly TodoDbContext _dbContext = dbContext;
    public async Task<IEnumerable<TodoItem>> GetTodosAsync()
    {
        return await _dbContext.Todos.ToListAsync();
    }

    public async Task<TodoItem?> GetTodoByIdAsync(int id)
    {
        return await _dbContext.Todos.FindAsync(id);
    }

    public async Task AddTodoAsync(TodoItem todo)
    {
        await _dbContext.Todos.AddAsync(todo);
        await _dbContext.SaveChangesAsync();
    }

    public async Task ToggleCompleteAsync(int id)
    {
        var todo = await GetTodoByIdAsync(id);
        if (todo is null) return;
        todo.IsCompleted = !todo.IsCompleted;
        _dbContext.Entry(todo).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteTodoAsync(int id)
    {
        var todo = await GetTodoByIdAsync(id);
        if (todo is null) return;
        _dbContext.Todos.Remove(todo);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteCompletedTodosAsync()
    {
        var todos = _dbContext.Todos;
        todos.RemoveRange(todos.Where(todo => todo.IsCompleted));
        await _dbContext.SaveChangesAsync();
    }
}