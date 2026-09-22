using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class NewsletterSubscriber
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
}