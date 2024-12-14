using Microsoft.EntityFrameworkCore;

namespace MVC.TODO.LONCHANICK.DB;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }
    
    public DbSet<TODO> TodoItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TODO>().HasData(
            new TODO { Id = 1, Name = "TODO1"},
            new TODO { Id = 2, Name = "TODO2"},
            new TODO { Id = 3, Name = "TODO3"}
            );

    }
}

public class TODO
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public bool IsComplete { get; set; } = false;
}
