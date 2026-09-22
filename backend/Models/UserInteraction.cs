namespace backend.Models;

public class UserInteraction
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public string UserId { get; set; } = "default_user"; // Auth kurulana kadar tekil kullanıcı kimliği
    public bool IsLiked { get; set; } = false;
    public bool IsInWatchlist { get; set; } = false;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}