namespace MVC.Todo.K_MYR.Models
{
    public class TodoTaskPostModel
    {       
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Group { get; set; }
        public bool IsCompleted { get; set; }
        
    }
}
