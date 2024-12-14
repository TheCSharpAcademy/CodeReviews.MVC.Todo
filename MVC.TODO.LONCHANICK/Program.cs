using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MVC.TODO.LONCHANICK.DB;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//injects class for connection!
builder.Services.AddDbContext<TodoContext>(
    Options => Options.UseSqlServer(builder.Configuration.GetConnectionString("TODOStringConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

var todoEndPoint = app.MapGroup("/api/todoItems");

todoEndPoint.MapGet("/", async (TodoContext db) => await db.TodoItems.ToListAsync());

todoEndPoint.MapGet("/{id}", async (int id, TodoContext db) =>
    await db.TodoItems.FindAsync(id)
        is TODO todo
            ? Results.Ok(todo)
            : Results.NotFound());


todoEndPoint.MapPost("/", async (TODO obj, TodoContext db) => 
{
    db.TodoItems.Add(obj);
    await db.SaveChangesAsync();

    return Results.Created($"/{obj.Id}", obj);
}); 


todoEndPoint.MapDelete("/{id}", async (int id, TodoContext db) =>
{
    if (await db.TodoItems.FindAsync(id) is TODO todo)
    {
        db.TodoItems.Remove(todo);
        db.SaveChanges();
        return Results.NoContent();
    }

    return Results.NotFound();
});


todoEndPoint.MapPut("{id}", async (int id, TODO todoInputUpdate, TodoContext db) => 
{
    TODO? todo = await db.TodoItems.FindAsync(id);
    
    if (todo is null) return Results.NotFound();

    todo.Name = todoInputUpdate.Name;
    todo.IsComplete = todoInputUpdate.IsComplete;

    db.TodoItems.Update(todo);
    await db.SaveChangesAsync();

    return Results.NoContent();

});


app.UseHttpsRedirection();

app.UseDefaultFiles();//added from fetch tutorial
app.UseStaticFiles();//added from fetch tutorial

app.Run();
 
