using Microsoft.EntityFrameworkCore;
using TodoList.Doc415.Models;

namespace TodoList.Doc415.Data;

public class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options) : base(options) { }

    public DbSet<Todo> Todos { get; set; }
}
