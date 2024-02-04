using System.ComponentModel.DataAnnotations;

namespace MVC.Todo.K_MYR.Models;

public class TodoTask
{
    public int Id { get; set; }
    [StringLength(50, MinimumLength = 1)]
    public string? Name { get; set; }
    [StringLength(250)]
    public string? Description { get; set; }
    public string? Group { get; set; }
    public bool IsCompleted { get; set; }
}
