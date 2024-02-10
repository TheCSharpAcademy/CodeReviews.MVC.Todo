using Microsoft.EntityFrameworkCore;
using ToDo.StevieTV.Models;

namespace ToDo.StevieTV.Database;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options)
    {
    }

    public DbSet<Todo> Todos { get; set; }
}