using Microsoft.EntityFrameworkCore;
using Todo.Models;

namespace Todo.Data;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.SeedTodos();
    }
}

public static class ModelBuilderExtensions
{
    public static void SeedTodos(this ModelBuilder modelBuilder)
    {
        List<TodoItem> todos = [
        new() {Id = 1, Title = "Go shopping", IsCompleted = false},
        new() {Id = 2, Title = "Wash dishes", IsCompleted = false},
        new() {Id = 3, Title = "Learn new language", IsCompleted = false},
        new() {Id = 4, Title = "Finish Todo Project", IsCompleted = false},
        new() {Id = 5, Title = "Find a job", IsCompleted = false}
        ];
        modelBuilder.Entity<TodoItem>()
            .HasData(todos);
    }
}