using Microsoft.EntityFrameworkCore;
using Todo.WillowBear.Models;

namespace Todo.WillowBear.Data
{
    public class TodoDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=TodoList.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new TodoItemConfiguration());
        }
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
