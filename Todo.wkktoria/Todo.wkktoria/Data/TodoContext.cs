using Microsoft.EntityFrameworkCore;
using Todo.wkktoria.Models;

namespace Todo.wkktoria.Data;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;
}