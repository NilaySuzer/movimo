public class UserUpdateDto
{
    public string? FullName { get; set; }
    public string Username { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? BannerUrl { get; set; }       // <-- BU EKLİ Mİ?
    public string? PinnedFavorites { get; set; } // <-- BU EKLİ Mİ?
}