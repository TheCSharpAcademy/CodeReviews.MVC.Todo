using Microsoft.EntityFrameworkCore;
using Todo.jollejonas.Models;

namespace Todo.jollejonas.Data;
public class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options)
        : base(options) { }

    public DbSet<TodoItem> TodoItems { get; set; } = null;
}