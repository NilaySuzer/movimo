namespace backend.Models;

public class Review
{
    public int Id { get; set; }
    public int MovieId { get; set; }

    public int UserId { get; set; }
    public string User { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public bool IsSpoiler { get; set; } = false;
    public int Upvotes { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}