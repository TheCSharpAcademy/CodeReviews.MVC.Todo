using Microsoft.EntityFrameworkCore;
using Todo.Data;
using Todo.Models;
using Todo.Repositories;
using Todo.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TodoDbContext>(opt => opt.UseInMemoryDatabase("Todos"));
builder.Services.AddScoped<ITodosRepository, TodosRepository>();
builder.Services.AddScoped<ITodosService, TodosService>();

var app = builder.Build();

var todoItems = app.MapGroup("todos");
todoItems.MapGet("/", async (ITodosService todosService) => await todosService.GetTodos());
todoItems.MapPost("/", async(ITodosService todosService, TodoItem todo) => await todosService.AddTodo(todo));
todoItems.MapPut("/{id:int}", async (ITodosService todosService, int id) => await todosService.ToggleTodoCompleted(id));
todoItems.MapDelete("/{id:int}", async (ITodosService todosService, int id) => await todosService.DeleteTodo(id));
todoItems.MapDelete("/", async (ITodosService todosService) => await todosService.DeleteCompletedTodos());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    context.Database.EnsureCreated();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.Run();