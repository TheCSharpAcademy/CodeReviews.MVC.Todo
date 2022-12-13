using Microsoft.EntityFrameworkCore;
using Todo.WillowBear.Models;
using Serilog;

namespace Todo.WillowBear.Data
{
    public class TodoDbContext : DbContext
    {

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=TodoList.db");
        }

        // 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new TodoItemConfiguration());
        }
        public DbSet<TodoItem> TodoItems { get; set; }

        //Add Todo
        /// <summary>
        /// Adds param to Database table
        /// </summary>
        /// <param name="todoItem"></param>
        public void AddTodoItem(TodoItem todoItem)
        {

            if (todoItem == null)
            {
                Log.Debug($"{todoItem} is null");
            }


            try
            {
                TodoItems.Add(todoItem!);
                SaveChanges();
                Log.Information($"Added {todoItem} to database successfully");
            }
            catch (Exception e)
            {

                Log.Information($"Unable to add new Todo Item. ");
                Log.Debug(e.Message);
            }
        }

        // edit todoitem
        /// <summary>
        /// Edits TodoItem in Database
        /// </summary>
        /// <param name="todoItem"></param>
        public void EditTodoItem(TodoItem todoItem)
        {
            if (todoItem == null)
            {
                Log.Debug($"{todoItem} is null");
            }

            try
            {
                TodoItems.Update(todoItem!);
                SaveChanges();
                Log.Information($"Todo Item {todoItem!.Id} has been updated successfully");
            }
            catch (Exception e)
            {

                Log.Information($"Unable to edit Todo Item. ");
                Log.Debug(e.Message);
            }
        }

        // delete todoitem
        /// <summary>
        /// Deletes TodoItem from Database
        /// </summary>
        /// <param name="todoItem"></param>
        public void DeleteTodoItem(TodoItem todoItem)
        {
            if (todoItem == null)
            {
                Log.Debug($"{todoItem} is null");
            }

            try
            {
                TodoItems.Remove(todoItem!);
                SaveChanges();
                Log.Information($"Todo Item {todoItem!.Id} has been deleted successfully");
            }
            catch (Exception e)
            {
                Log.Information($"Unable to delete Todo Item. ");
                Log.Debug(e.Message);
            }
        }

        // get todoitem
        /// <summary>
        /// Returns a single TodoItem from Database if it exists
        /// </summary>
        /// <param name="id"></param>
        /// <returns>TodoItem Object || null if does not exist</returns>
        public TodoItem? GetTodoItemById(int id)
        {
            try
            {
                var todoItem = TodoItems.Find(id);
                if (todoItem == null)
                {
                    Log.Debug($"Todo Item {id} does not exist");
                    return null;
                }
                else
                {
                    Log.Information($"Todo Item {id} has been found");
                    return todoItem;
                }
            }
            catch (Exception e)
            {
                Log.Information($"Unable to retrieve Todo Item. ");
                Log.Debug(e.Message);
                return null;
            }
        }

        // get all todoitems
        /// <summary>
        /// Returns all TodoItems from Database
        /// </summary>
        /// <returns>List of TodoItems || null if does not exist</returns>
        public List<TodoItem>? GetAllTodoItems()
        {
            try
            {
                var todoItems = TodoItems.ToList() ?? new List<TodoItem>();
                if (todoItems.Count >= 1)
                {
                    Log.Information($"Todo Items have been found and retrieved successfully");
                    return todoItems;
                }
                else
                {
                    Log.Debug($"No Todo Items exist");
                    return null;
                }
            }
            catch (Exception e)
            {
                Log.Information($"Unable to retrieve Todo Items. ");
                Log.Debug(e.Message);
                return null;
            }
        }
    }
}
