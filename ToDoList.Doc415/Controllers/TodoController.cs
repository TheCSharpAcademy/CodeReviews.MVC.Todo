using Microsoft.AspNetCore.Mvc;
using TodoList.Doc415.Models;
using TodoList.Doc415.Repository;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoList.Doc415.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoRepositoty _repository;
        public TodoController(TodoRepositoty repository)
        {
            _repository = repository;
        }

        // GET: api/<TodoController>
        [HttpGet]
        public async Task<ActionResult<List<Todo>>> Get()
        {
            var itemlist = await _repository.GetAllTodos();
            return Ok(itemlist);
        }

        // POST api/<TodoController>
        [HttpPost]
        public async Task<ActionResult> Add([FromBody] Todo todo)
        {
            await _repository.AddTodo(todo);
            return Ok();
        }

        // PUT api/<TodoController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Todo todo)
        {
            int _id = int.Parse(id);
            if (_id != todo.Id)
            {
                await Task.FromResult(result: BadRequest());
            }
            await _repository.UpdateTodo(_id, todo);
            return Ok();
        }

        // DELETE api/<TodoController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _repository.DeleteTodo(id);
        }
    }
}
