namespace backend.Models;

public class MovieTrivia
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}