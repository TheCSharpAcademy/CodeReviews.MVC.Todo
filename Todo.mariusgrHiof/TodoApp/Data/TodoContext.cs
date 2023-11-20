using Microsoft.EntityFrameworkCore;
using TodoApp.Models;

namespace TodoApp.Data;
public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<TodoItem> Todos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoItem>().HasData(
            new TodoItem
            {
                Id = 1,
                Name = "Test",
                IsComplete = true,
            },
            new TodoItem
            {
                Id = 2,
                Name = "Test 2",
                IsComplete = false,
            },
            new TodoItem
            {
                Id = 3,
                Name = "Test 3",
                IsComplete = true,
            }
            );
    }
}

