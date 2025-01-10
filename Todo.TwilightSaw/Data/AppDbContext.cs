using Microsoft.EntityFrameworkCore;

namespace Todo.TwilightSaw.Data;

public class AppDbContext : DbContext
{
    public DbSet<Models.Todo> Todos { get; set; }
 

    private readonly IConfiguration _configuration;
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Models.Todo>();
    }
}