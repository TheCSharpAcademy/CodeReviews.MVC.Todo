using Microsoft.EntityFrameworkCore;
using ToDo.StevieTV.Database;
using ToDo.StevieTV.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

var todoItems = app.MapGroup("/todoitems");

todoItems.MapGet("/", GetAllTodos);
todoItems.MapGet("/complete", GetCompleteTodos);
todoItems.MapGet("/{id}", GetTodoById);
todoItems.MapPost("/", CreateTodo);
todoItems.MapPut("/{id}", UpdateTodo);
todoItems.MapDelete("/{id}", DeleteTodo);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
return;

static async Task<IResult> GetAllTodos(TodoContext db) => TypedResults.Ok(await db.Todos.Select(x => new TodoItemDTO(x)).ToArrayAsync());

static async Task<IResult> GetCompleteTodos(TodoContext db) => TypedResults.Ok(await db.Todos.Where(t => t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync());

static async Task<IResult> GetTodoById(int id, TodoContext db) =>
    await db.Todos.FindAsync(id)
        is Todo todo
        ? TypedResults.Ok(new TodoItemDTO(todo))
        : TypedResults.NotFound();

static async Task<IResult> CreateTodo(TodoItemDTO todoItemDto, TodoContext db)
{
    var todoItem = new Todo
    {
        IsComplete = todoItemDto.IsComplete,
        Name = todoItemDto.Name
    };
    
    db.Todos.Add(todoItem);
    await db.SaveChangesAsync();

    todoItemDto = new TodoItemDTO(todoItem);

    return TypedResults.Created($"/todoitems/{todoItem.Id}", todoItemDto);
}

static async Task<IResult> UpdateTodo(int id, TodoItemDTO todoItemDto, TodoContext db)
{
    var todo = await db.Todos.FindAsync(id);

    if (todo is null) return TypedResults.NotFound();

    todo.Name = todoItemDto.Name;
    todo.IsComplete = todoItemDto.IsComplete;

    await db.SaveChangesAsync();

    return TypedResults.NoContent();
}

async Task<IResult> DeleteTodo(int id, TodoContext db)
{
    if (await db.Todos.FindAsync(id) is not Todo todo) return TypedResults.NotFound();

    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
}