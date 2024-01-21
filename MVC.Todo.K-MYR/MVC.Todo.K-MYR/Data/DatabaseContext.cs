using Microsoft.EntityFrameworkCore;
using MVC.Todo.K_MYR.Models;


namespace MVC.Todo.K_MYR.Data;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{   
    public DbSet<TodoTask> Todos { get; set; }
}
