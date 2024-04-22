using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Testcontainers.MsSql;
using TodoList.Controllers;
using TodoList.Models;

namespace TodoList.Tests;

public class TodoItemControllerTests : IAsyncLifetime
{
    private readonly MsSqlContainer _container;
    private TodoItemsController _controller;

    public TodoItemControllerTests()
    {
        _container = new MsSqlBuilder()
          .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
          .Build();
    }

    [Fact]
    public async Task GetTodoItems_WhenDatabaseIsEmpty_ShouldReturnNotFoundAsync()
    {
        // Act
        ActionResult<IEnumerable<TodoItem>> result = await _controller.GetTodoItems();

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetTodoItems_WithSeededDatabase_ShouldReturnListOfTodosAsync()
    {
        // Arrange
        List<TodoItem> todoItems = [
            new() { Name = "Test Item 1" },
            new() { Name = "Test Item 2" }
        ];
        await SeedDatabase(todoItems);

        // Act
        ActionResult<IEnumerable<TodoItem>> result = await _controller.GetTodoItems();

        // Assert
        Assert.Equivalent(todoItems, result.Value);
    }

    [Fact]
    public async Task GetTodoItem_WithSeededDatabase_ShouldReturnTodoItemAsync()
    {
        // Arrange
        List<TodoItem> todoItems = [
            new() { Name = "Test Item 1" },
            new() { Name = "Test Item 2" }
        ];
        await SeedDatabase(todoItems);
        TodoItem expected = todoItems.First();

        // Act
        ActionResult<TodoItem> result = await _controller.GetTodoItem(1);

        // Assert
        Assert.Equivalent(expected, result.Value);
    }

    private async Task SeedDatabase(List<TodoItem> todoItems)
    {
        foreach (TodoItem todoItem in todoItems)
        {
            await _controller.PostTodoItem(todoItem);
        }
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        string connectionString = _container.GetConnectionString();
        DbContextOptions<TodoContext> dbContextOptions = new DbContextOptionsBuilder<TodoContext>()
            .UseSqlServer(connectionString)
            .Options;
        TodoContext context = new(dbContextOptions);
        context.Database.Migrate();
        _controller = new TodoItemsController(context);
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync().AsTask();
    }
}