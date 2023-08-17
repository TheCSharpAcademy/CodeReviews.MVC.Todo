using kmakai.MVC.TodoApp.Models;
using Microsoft.EntityFrameworkCore;

namespace kmakai.MVC.TodoApp.DataAccess;

public class TodoContext: DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = default!;
}

