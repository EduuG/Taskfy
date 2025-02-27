namespace Backend.DTOs;
[Serializable]

public class TaskFilterDto
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public bool? IsCompleted { get; set; }
}