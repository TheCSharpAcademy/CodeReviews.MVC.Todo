using Microsoft.EntityFrameworkCore;
using Todo.Models;

namespace Todo.Data;

public class TodoContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<TodoItem> todos { get; set; }
}