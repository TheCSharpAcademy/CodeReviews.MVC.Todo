﻿using MVC.Todo.K_MYR.Models;

namespace MVC.Todo.K_MYR.Data;

public static class SeedData
{
    public static void Initialize(DatabaseContext db)
    {
        if (!db.Todos.Any())
        {
            db.Todos.AddRange(
                new TodoTask
                {
                    Name = "Laundry",
                    IsCompleted = false,
                    Group = "Household Chores",
                    Description = "I need to do my dirty laundry until tomorrow"
                },
                new TodoTask
                {
                    Name = "Go for a run",
                    IsCompleted = false,
                    Group = "Exercise",
                    Description = "i will go for a run in the park for at least 30 mins today"
                },
                new TodoTask
                {
                    Name = "Weight Training",
                    IsCompleted = false,
                    Group = "Exercise",
                    Description = "I ll go to the gym and finish a push workout"
                },
                new TodoTask
                {
                    Name = "Do homework",
                    IsCompleted = false,
                    Group = "School",
                    Description = "i will do my homework so i can play games afterwards for the rest of the day"
                },
                new TodoTask
                {
                    Name = "Finish Todo Proj",
                    IsCompleted = true,
                    Group = "Programming"
                }
            );
        }
        db.SaveChangesAsync();
    }
}
