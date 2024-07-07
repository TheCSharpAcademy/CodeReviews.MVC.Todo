using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Database;

class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options)
        : base(options) { }

    public DbSet<Todo> Todos => Set<Todo>();
}