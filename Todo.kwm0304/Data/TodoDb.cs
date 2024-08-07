using Microsoft.EntityFrameworkCore;
using Todo.kwm0304.Models;


namespace Todo.kwm0304.Data;

public class TodoDb : DbContext
{
  public TodoDb(DbContextOptions<TodoDb> options)
    : base(options) { }

  public DbSet<MyTodo> Todos => Set<MyTodo>();
}