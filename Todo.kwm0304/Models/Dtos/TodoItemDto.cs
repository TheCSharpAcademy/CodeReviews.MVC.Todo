namespace Todo.kwm0304.Models.Dtos;

public class TodoItemDto
{
  public int Id { get; set; }
  public string? Name { get; set; }
  public bool IsComplete { get; set; }

  public TodoItemDto() { }
  public TodoItemDto(MyTodo todoItem) =>
  (Id, Name, IsComplete) = (todoItem.Id, todoItem.Name, todoItem.IsComplete);
}
