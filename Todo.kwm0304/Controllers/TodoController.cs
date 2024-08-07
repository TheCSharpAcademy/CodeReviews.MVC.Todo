using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.kwm0304.Data;
using Todo.kwm0304.Models;

namespace Todo.kwm0304.Controllers;

[ApiController]
[Route("api/todoitems")]
public class TodoController(ILogger<TodoController> logger, TodoDb context) : ControllerBase
{
    private readonly ILogger<TodoController> _logger = logger;
    private readonly TodoDb _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MyTodo>>> GetAllTodos()
    {
        return await _context.Todos.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MyTodo>> GetTodoById(int id)
    {
        var todoItem = await _context.Todos.FindAsync(id);
        if (todoItem is null)
        {
            _logger.LogWarning($"Todo item with id {id} not found.");
            return NotFound();
        }
        return todoItem;
    }

    [HttpPost]
    public async Task<ActionResult<MyTodo>> CreateTodo(MyTodo todoItem)
    {
        _context.Todos.Add(todoItem);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Todo item created with id {todoItem.Id}.");
        return CreatedAtAction(nameof(GetTodoById), new { id = todoItem.Id }, todoItem);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteById(int id)
    {
        var todoItem = await _context.Todos.FindAsync(id);
        if (todoItem is null)
        {
            _logger.LogWarning($"Todo item with id {id} not found.");
            return NotFound();
        }
        _context.Todos.Remove(todoItem);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Todo item with id {id} deleted.");
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateById(int id, MyTodo todoItem)
    {
        if (id != todoItem.Id)
        {
            return BadRequest();
        }
        _context.Entry(todoItem).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TodoItemExists(id))
            {
                _logger.LogWarning($"Todo item with id {id} not found.");
                return NotFound();
            }
            else
            {
                _logger.LogError($"Concurrency error while updating todo item with id {id}.");
                throw;
            }
        }
        _logger.LogInformation($"Todo item with id {id} updated.");
        return NoContent();
    }

    private bool TodoItemExists(int id)
    {
        return _context.Todos.Any(e => e.Id == id);
    }
}