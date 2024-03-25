using Microsoft.EntityFrameworkCore;

namespace TodoListAPI.Models;

public class TodoListContext(DbContextOptions<TodoListContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos {get; set;}
}