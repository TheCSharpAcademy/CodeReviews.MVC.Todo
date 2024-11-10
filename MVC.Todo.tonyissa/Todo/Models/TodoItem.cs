namespace Todo.Models;

public class TodoItem
{
    public int Id { get; set; }
    public bool IsComplete { get; set; } = false;
    public string Name { get; set; } = string.Empty;
}