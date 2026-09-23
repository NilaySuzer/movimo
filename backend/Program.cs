using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. MSSQL DbContext Bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. React Frontend (Port 5174) için CORS İzni
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// --- GÜNCEL VE SAĞLAM CAST SEED BAŞLANGICI ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<backend.Data.AppDbContext>();

    // Varsa eski eksik cast verilerini temizleyelim ki çift kayıt olmasın
    if (context.MovieCasts.Any())
    {
        context.MovieCasts.RemoveRange(context.MovieCasts);
        context.SaveChanges();
    }

    // Filmleri başlıklarına göre bulalım (ID bağımsız garanti çözüm):
    var darkKnight = context.Movies.FirstOrDefault(m => m.Title.Contains("Dark Knight"));
    var corpseBride = context.Movies.FirstOrDefault(m => m.Title.Contains("Corpse Bride"));
    var interstellar = context.Movies.FirstOrDefault(m => m.Title.Contains("Interstellar"));

    var newCasts = new List<backend.Models.MovieCast>();

    // 1. The Dark Knight
    if (darkKnight != null)
    {
        newCasts.AddRange(new[]
        {
            new backend.Models.MovieCast { MovieId = darkKnight.Id, ActorName = "Christian Bale", CharacterName = "Bruce Wayne / Batman", PhotoUrl = "https://image.tmdb.org/t/p/w300/b7fTC9WFkgqGOv77mLQ0ig0XqWb.jpg", DisplayOrder = 1 },
            new backend.Models.MovieCast { MovieId = darkKnight.Id, ActorName = "Heath Ledger", CharacterName = "Joker", PhotoUrl = "https://image.tmdb.org/t/p/w300/5Y9HnYYa9jF4NuY9lENFyWRJHJW.jpg", DisplayOrder = 2 },
            new backend.Models.MovieCast { MovieId = darkKnight.Id, ActorName = "Gary Oldman", CharacterName = "Jim Gordon", PhotoUrl = "https://image.tmdb.org/t/p/w300/2v9Fs9fvnDcPr2m0vMGz6CCgP9n.jpg", DisplayOrder = 3 },
            new backend.Models.MovieCast { MovieId = darkKnight.Id, ActorName = "Michael Caine", CharacterName = "Alfred Pennyworth", PhotoUrl = "https://image.tmdb.org/t/p/w300/bV3Zv5T2vE1w6Z8H9YQ5X8n1.jpg", DisplayOrder = 4 }
        });
    }

    // 2. Corpse Bride
    if (corpseBride != null)
    {
        newCasts.AddRange(new[]
        {
            new backend.Models.MovieCast { MovieId = corpseBride.Id, ActorName = "Johnny Depp", CharacterName = "Victor Van Dort (Ses)", PhotoUrl = "https://image.tmdb.org/t/p/w300/il7m2rZ4bZl99zZ4bZl99zZ4bZl.jpg", DisplayOrder = 1 },
            new backend.Models.MovieCast { MovieId = corpseBride.Id, ActorName = "Helena Bonham Carter", CharacterName = "Emily - Corpse Bride (Ses)", PhotoUrl = "https://image.tmdb.org/t/p/w300/DDeITcCpnBd0qNXDef1S5Msl7z.jpg", DisplayOrder = 2 },
            new backend.Models.MovieCast { MovieId = corpseBride.Id, ActorName = "Emily Watson", CharacterName = "Victoria Everglot (Ses)", PhotoUrl = "https://image.tmdb.org/t/p/w300/bd0qNXDef1S5Msl7zDDeITcCpn.jpg", DisplayOrder = 3 }
        });
    }

    // 3. Interstellar
    if (interstellar != null)
    {
        newCasts.AddRange(new[]
        {
            new backend.Models.MovieCast { MovieId = interstellar.Id, ActorName = "Matthew McConaughey", CharacterName = "Cooper", PhotoUrl = "https://image.tmdb.org/t/p/w300/wDeITcCpnBd0qNXDef1S5Msl7z.jpg", DisplayOrder = 1 },
            new backend.Models.MovieCast { MovieId = interstellar.Id, ActorName = "Anne Hathaway", CharacterName = "Brand", PhotoUrl = "https://image.tmdb.org/t/p/w300/tL9EnYRhUgJq0n0UfO2R1a0o5E.jpg", DisplayOrder = 2 }
        });
    }

    if (newCasts.Any())
    {
        context.MovieCasts.AddRange(newCasts);
        context.SaveChanges();
        Console.WriteLine($">>> TOPLAM {newCasts.Count} OYUNCU BAŞARIYLA GÜNCELLENDİ! <<<");
    }
}
// --- GÜNCEL VE SAĞLAM CAST SEED BİTİŞİ ---


app.Run();
