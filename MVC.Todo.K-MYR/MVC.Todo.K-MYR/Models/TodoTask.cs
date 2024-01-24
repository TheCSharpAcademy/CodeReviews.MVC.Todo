using System.ComponentModel.DataAnnotations;

namespace MVC.Todo.K_MYR.Models;

public class TodoTask
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Group { get; set; }
    public bool IsCompleted { get; set; }
}
