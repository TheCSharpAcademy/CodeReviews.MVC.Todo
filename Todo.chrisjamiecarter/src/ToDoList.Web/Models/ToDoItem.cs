namespace ToDoList.Web.Models;

/// <summary>
/// Represents a to-do item in the ToDoList application.
/// This class contains properties for the unique identifier, name, and completion status of the to-do item.
/// </summary>
/// <remarks>
/// The Id property is a GUID that uniquely identifies each to-do item.
/// The Name property holds the name or description of the to-do item, and it can be null.
/// The IsComplete property indicates whether the to-do item has been completed.
/// </remarks>
public class ToDoItem
{
    #region Properties

    public Guid Id { get; set; }

    public string? Name { get; set; }

    public bool IsComplete { get; set; }

    #endregion
}
