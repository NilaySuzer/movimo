using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Movie
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Director { get; set; } = string.Empty;

    public int ReleaseYear { get; set; }

    public string? PosterUrl { get; set; }

    public string? Summary { get; set; }
    public string Category { get; set; } = "general";
    public double AverageRating { get; set; } = 0.0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}