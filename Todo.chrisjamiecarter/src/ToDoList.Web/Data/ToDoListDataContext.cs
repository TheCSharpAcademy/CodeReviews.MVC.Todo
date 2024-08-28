using Microsoft.EntityFrameworkCore;
using ToDoList.Web.Models;

namespace ToDoList.Web.Data;

/// <summary>
/// Represents the Entity Framework database context for the ToDoList application.
/// This context is responsible for managing the database connection and providing
/// access to the ToDoItem entities.
/// </summary>
/// <remarks>
/// This class inherits from DbContext and uses the provided DbContextOptions to configure
/// the context. It includes a DbSet property for ToDoItem entities.
/// </remarks>
public class ToDoListDataContext : DbContext
{
    #region Constructors

    public ToDoListDataContext(DbContextOptions<ToDoListDataContext> options) : base(options) { }

    #endregion
    #region Properties

    public DbSet<ToDoItem> ToDoItem => Set<ToDoItem>();

    #endregion
}
