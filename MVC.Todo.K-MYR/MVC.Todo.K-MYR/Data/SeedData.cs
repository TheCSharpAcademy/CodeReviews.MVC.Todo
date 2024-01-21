using MVC.Todo.K_MYR.Models;

namespace MVC.Todo.K_MYR.Data;

public static class SeedData
{
    public static void Initialize(DatabaseContext db)
    {
        if(!db.Todos.Any())
        {
            db.Todos.AddRange(
                new TodoTask
                {
                    Name = "Laundry",
                    IsCompleted = false,
                    Group = "Household Chores"
                },
                new TodoTask
                {
                    Name = "Go for a run",
                    IsCompleted = false,
                    Group = "Exercise"
                }
            );
        }
        db.SaveChangesAsync();    
    }
}
