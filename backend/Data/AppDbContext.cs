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

    public DbSet<MovieCast> MovieCasts { get; set; }

    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<MovieTrivia> MovieTrivias => Set<MovieTrivia>();
    public DbSet<UserInteraction> UserInteractions => Set<UserInteraction>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<MovieCast>()
              .HasOne(c => c.Movie)
              .WithMany(m => m.Cast)
              .HasForeignKey(c => c.MovieId);

        // Başlangıç anket seçenekleri
        modelBuilder.Entity<PollOption>().HasData(
            new PollOption { Id = 1, Text = "The Dark Knight", Votes = 42 },
            new PollOption { Id = 2, Text = "Inception", Votes = 18 },
            new PollOption { Id = 3, Text = "Interstellar", Votes = 65 },
            new PollOption { Id = 4, Text = "Tenet", Votes = 29 }
        );

        modelBuilder.Entity<MovieTrivia>().HasData(
                   // Interstellar (MovieId = 1)
                   new MovieTrivia
                   {
                       Id = 1,
                       MovieId = 1,
                       Title = "🌌 Bilimsel Danışmanlık & Kara Delik",
                       Content = "Nobel ödüllü astrofizikçi Kip Thorne, filmdeki Gargantua kara deliğinin görselleştirilmesi için denklemler yazdı. Bu simülasyonlar astrofizik literatürüne yeni bilimsel makaleler kazandırdı."
                   },
                   new MovieTrivia
                   {
                       Id = 2,
                       MovieId = 1,
                       Title = "🌽 500 Dönümlük Gerçek Mısır Tarlası",
                       Content = "Christopher Nolan, CGI kullanmak yerine film için Calgary'de gerçekten 500 dönümlük mısır tarlası ektirdi. Çekimler bittikten sonra mısırlar satılarak prodüksiyona kâr sağlandı."
                   },

                   // The Dark Knight (MovieId = 2)
                   new MovieTrivia
                   {
                       Id = 3,
                       MovieId = 2,
                       Title = "🃏 Heath Ledger'ın Doğaçlama Alkışı",
                       Content = "Joker'in nezarethanede Gordon terfi ettirildiğinde alaycı şekilde alkışladığı sahne senaryoda yoktu; tamamen Heath Ledger'ın doğaçlamasıydı."
                   },
                   new MovieTrivia
                   {
                       Id = 4,
                       MovieId = 2,
                       Title = "💥 Gerçek Hastane Patlaması",
                       Content = "Hastane patlatma sahnesinde minyatür yerine Battersea'deki gerçek bir yıkım alanı kullanıldı. Patlamada yaşanan kısa duraklama kontrollü bir efekt gecikmesiydi ve Ledger sahneyi bozmadan devam ettirdi."
                   },

                   // Corpse Bride (MovieId = 4)
                   new MovieTrivia
                   {
                       Id = 5,
                       MovieId = 4,
                       Title = "⏱️ Saniyede 24 Kare Emek",
                       Content = "Stop-motion tekniğiyle çekilen filmde kuklaların kafalarının içinde mikro dişli mekanizmaları vardı. Bir animatörün sadece 1-2 saniyelik sahneyi tamamlaması bazen bir tam haftasını alıyordu."
                   }
               );
    }
}