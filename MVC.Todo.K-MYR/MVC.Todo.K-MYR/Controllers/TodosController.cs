using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVC.Todo.K_MYR.Data;
using MVC.Todo.K_MYR.Models;

namespace MVC.Todo.K_MYR.Controllers;

[ApiController]
[Route("[controller]")]
public class TodosController : ControllerBase
{
    private readonly ILogger<TodosController> _logger;
    private readonly DatabaseContext _context;
    public TodosController(DatabaseContext context, ILogger<TodosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetTodos() => Ok(await _context.Todos.ToListAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoTask>> GetTodo([FromRoute]int id)
    {
        var todo = await _context.Todos.FindAsync(id);

        return todo is null ? NotFound() : Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult> PostTodo([FromBody]TodoTaskPostModel todoInput)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        TodoTask todo = new()
        {
            Name = todoInput.Name,
            Description = todoInput.Description,
            Group = todoInput.Group,
            IsCompleted = todoInput.IsCompleted,
        };

        try
        {
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (DbUpdateConcurrencyException) when (!TodoExists(todo.Id)) 
        {
            return NotFound();
        }   
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutTodo([FromRoute]int id, [FromBody]TodoTask todoInput)
    {
        if (id != todoInput.Id)
            return BadRequest();
        
        if(!ModelState.IsValid)
            return BadRequest();

        var todo = await _context.Todos.FindAsync(id);

        if(todo is null)
            return NotFound();

        todo.Name = todoInput.Name;
        todo.Description = todoInput.Description;
        todo.Group = todoInput.Group;
        todo.IsCompleted = todoInput.IsCompleted;

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
            
        }
        catch(DbUpdateConcurrencyException) when (!TodoExists(todo.Id))
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTodo([FromRoute]int id)
    {
        var todo = await _context.Todos.FindAsync(id);

        if (todo is null)
            return NotFound();

        _context.Todos.Remove(todo);

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException) when (!TodoExists(todo.Id))
        {
            return NotFound();
        }
    }

    private bool TodoExists(int id) => _context.Todos.Find(id) is not null;
    
}
