namespace Backend.Models;
[Serializable]

public class Task
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public bool Active { get; set; } = true;
    public int Order { get; set; }
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
}