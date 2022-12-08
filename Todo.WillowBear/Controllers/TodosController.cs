using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Diagnostics;
using Todo.WillowBear.Data;
using Todo.WillowBear.Models;

namespace Todo.WillowBear.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodosController : ControllerBase
{
    private readonly TodoDbContext _context;

    public TodosController(TodoDbContext context)
    {
        _context = context;
    }



    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
    {
        return await _context.TodoItems.OrderBy(x => x.IsDone).ToListAsync();

    }


    [HttpPost]
    [Route("Create")]
    public async void Create([FromBody] TodoItem todoItem)
    {
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();
    }

    [HttpDelete]
    [Route("Delete/{id}")]
    public async void Delete(int id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        _context.TodoItems.Remove(todoItem!);
        await _context.SaveChangesAsync();
    }

    [HttpPut]
    [Route("edit/{id}")]
    public async Task<ActionResult> Edit(int id, [FromBody] TodoItem todoItem)
    {
        if (id != todoItem.Id)
        {
            Log.Error("Id does not match");
            return BadRequest();
        }
        _context.Entry(todoItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {

            Log.Error("Error");
            throw;
        }
        return NoContent();
    }
}
