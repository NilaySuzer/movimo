namespace backend.Models;

public class UserInteraction
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public int UserId { get; set; }
    public bool IsLiked { get; set; } = false;
    public bool IsInWatchlist { get; set; } = false;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}