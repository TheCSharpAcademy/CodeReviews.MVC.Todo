namespace ToDoList.Web.Models;

/// <summary>
/// Represents a Data Transfer Object (DTO) for the ToDoItem entity in the ToDoList application.
/// This class is used to transfer data between different layers of the application.
/// </summary>
/// <remarks>
/// The default constructor initializes a new instance of the ToDoItemDto class.
/// The parameterized constructor initializes a new instance of the ToDoItemDto class
/// using the properties of an existing ToDoItem entity.
/// </remarks>
public class ToDoItemDto
{
    #region Constructors

    public ToDoItemDto()
    {

    }

    public ToDoItemDto(ToDoItem entity)
    {
        Id = entity.Id;
        Name = entity.Name;
        IsComplete = entity.IsComplete;
    }

    #endregion
    #region Properties

    public Guid Id { get; set; }

    public string? Name { get; set; }

    public bool IsComplete { get; set; }

    #endregion
}
