using System.Data;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using TodoListAPI.Models;

namespace TodoListAPI;

public class TodoListAPI
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: "AllowAnyOrigin",
                policy  =>
                {
                    policy.AllowAnyOrigin();
                    policy.AllowAnyMethod();
                    policy.AllowAnyHeader();
                });
        });

        builder.Services.AddDbContext<TodoListContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("TodoListConnectionString") ?? 
                throw new InvalidOperationException("Connection string 'MovieContext' not found.")));

        var app = builder.Build();

        app.UseRequestLocalization( new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en-US")
            }
        );

        using (var context = new TodoListContext( 
            app.Services.CreateScope().ServiceProvider.GetRequiredService<DbContextOptions<TodoListContext>>()))
            {
                context.Database.EnsureCreated();
            }

        var todoItems = app.MapGroup("/todolist");
        todoItems.MapGet("/", GetAllTodos);
        todoItems.MapGet("/{id}", GetTodoById);
        todoItems.MapPost("/", PostTodo);
        todoItems.MapDelete("/delete/{id}", DeleteTodo);
        todoItems.MapPut("/update/{id}", PutTodo);

        app.UseHttpsRedirection();
        app.UseCors("AllowAnyOrigin");
        app.Run();
    }

    public static async Task<IResult> PutTodo(TodoListContext dbContext, Todo todoItem, int id)
    {
        if(id != todoItem.Id)
            return TypedResults.BadRequest();

        if (todoItem != null && dbContext.Todos.Any( p => p.Id == todoItem.Id ) )
        {
            try
            {
                dbContext.Todos.Update(todoItem);
                await dbContext.SaveChangesAsync();
            }
            catch(DBConcurrencyException)
            {
                return TypedResults.StatusCode(500);
            }
        }
        else
            return TypedResults.NotFound();

        return TypedResults.Ok(todoItem);
    }

    public static async Task<IResult> GetAllTodos(TodoListContext dbContext)
    {
        return TypedResults.Ok(await dbContext.Todos.ToListAsync());
    }

    public static async Task<IResult> GetTodoById(TodoListContext dbContext, int id)
    {
        var todoItem = await dbContext.Todos.FindAsync(id);
        if(todoItem is null)
        {
            return TypedResults.NotFound();
        }
        else
            return TypedResults.Ok(todoItem);
    }

    public static async Task<IResult> PostTodo(TodoListContext dbContext, Todo todoItem)
    {
        dbContext.Todos.Add(todoItem);
        try
        {
            await dbContext.SaveChangesAsync();
        }
        catch
        {
            return TypedResults.BadRequest();
        }
        return TypedResults.Created($"todolist/{todoItem.Id}", todoItem);
    }

    public static async Task<IResult> DeleteTodo(TodoListContext dbContext, int id)
    {
        var todoItem = await dbContext.Todos.FindAsync(id);
        if (todoItem != null)
        {
            dbContext.Todos.Remove(todoItem);
        }
        else
            return TypedResults.NotFound();

        await dbContext.SaveChangesAsync();
        return TypedResults.Ok();
    }
}

