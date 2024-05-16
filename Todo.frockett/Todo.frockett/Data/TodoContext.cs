using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Todo.frockett.Models;

namespace Todo.frockett.Data;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
    : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; }
}
