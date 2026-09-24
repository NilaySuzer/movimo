using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty; // Güvenli şifre tutmak için

    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength]
    public string AvatarUrl { get; set; } = string.Empty;

    [MaxLength]
    public string BannerUrl { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;
    public string? PinnedFavorites { get; set; }
    [MaxLength(20)]
    public string Role { get; set; } = "User"; // "User" veya "Admin"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}