namespace Todo.WillowBear.Models
{

    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsDone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? DueDate { get; set; }
    }
}