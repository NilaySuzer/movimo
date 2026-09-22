using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<PollOption> PollOptions => Set<PollOption>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Başlangıç anket seçenekleri
        modelBuilder.Entity<PollOption>().HasData(
            new PollOption { Id = 1, Text = "The Dark Knight", Votes = 42 },
            new PollOption { Id = 2, Text = "Inception", Votes = 18 },
            new PollOption { Id = 3, Text = "Interstellar", Votes = 65 },
            new PollOption { Id = 4, Text = "Tenet", Votes = 29 }
        );
    }
}