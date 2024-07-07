using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class Todo
{
    public int Id { get; set; }
    public string? Name { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DueAt { get; set; }
    public bool IsComplete { get; set; } = false;
}