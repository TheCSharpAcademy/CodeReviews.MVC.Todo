using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Data;
using Todo.Models;

namespace Todo.Controllers;

[Produces("application/json")]
[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodoContext _context;

    public TodosController(TodoContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        return Ok(await _context.todos.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<IEnumerable<TodoItem>>> CreateTodo(TodoItem todo)
    {
        _context.todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodos), todo);
    }

    [HttpPut]
    public async Task<ActionResult<IEnumerable<TodoItem>>> UpdateTodo(TodoItem todo)
    {
        _context.todos.Update(todo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> DeleteTodo(int id)
    {
        var todoItem = await _context.todos.SingleOrDefaultAsync(item => item.Id == id);

        if (todoItem == null)
            return NotFound();

        _context.todos.Remove(todoItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}