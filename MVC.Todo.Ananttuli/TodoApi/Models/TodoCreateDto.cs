using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class TodoCreateDto
{
    public string? Name { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DueAt { get; set; }

    public bool IsComplete { get; set; } = false;
}