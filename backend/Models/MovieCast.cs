using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models;

public class MovieCast
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MovieId { get; set; }

    [Required]
    [MaxLength(150)]
    public string ActorName { get; set; } = string.Empty;

    [MaxLength(150)]
    public string CharacterName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string PhotoUrl { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0; // Kadrodaki sıralama (Başrol 1, 2, 3...)

    // Döngüsel JSON referans hatasını (Cycle reference) önlemek için [JsonIgnore]
    [JsonIgnore]
    [ForeignKey("MovieId")]
    public virtual Movie? Movie { get; set; }
}