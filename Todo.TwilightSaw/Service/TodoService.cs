using Todo.TwilightSaw.Repository;

namespace Todo.TwilightSaw.Service;

public class TodoService(IRepository<Models.Todo> repository)
{
    public void AddTodo(Models.Todo todo)
    {
        repository.Add(todo);
    }

    public List<Models.Todo> GetTodos()
    {
        return repository.GetAll().ToList();
    }

    public Models.Todo GetTodo(int id)
    {
        return repository.GetById(id);
    }

    public void UpdateTodo(Models.Todo todo)
    {
        repository.Update(todo);
    }

    public void DeleteTodo(int id)
    {
        repository.Delete(id);
    }
}