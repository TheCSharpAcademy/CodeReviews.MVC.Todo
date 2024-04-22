using Microsoft.EntityFrameworkCore;

namespace TodoList.Models;

public class TodoContext(DbContextOptions<TodoContext> options) : DbContext(options)
{
    public DbSet<TodoItem> TodoItems { get; set; }
}