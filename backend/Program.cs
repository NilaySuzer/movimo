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

// --- GEÇİCİ CAST SEED BAŞLANGICI ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<backend.Data.AppDbContext>();

    if (!context.MovieCasts.Any())
    {
        var casts = new List<backend.Models.MovieCast>
        {
            // Dark Knight (Id: 1)
            new() { MovieId = 1, ActorName = "Christian Bale", CharacterName = "Bruce Wayne / Batman", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2381/cache-2965-1594982633/image-w856.jpg", DisplayOrder = 1 },
            new() { MovieId = 1, ActorName = "Heath Ledger", CharacterName = "Joker", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2443/cache-3211-1594982937/image-w856.jpg", DisplayOrder = 2 },
            new() { MovieId = 1, ActorName = "Gary Oldman", CharacterName = "Jim Gordon", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2436/cache-3204-1594982903/image-w856.jpg", DisplayOrder = 3 },
            new() { MovieId = 1, ActorName = "Michael Caine", CharacterName = "Alfred", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2384/cache-2968-1594982645/image-w856.jpg", DisplayOrder = 4 },

            // Corpse Bride (Id: 2)
            new() { MovieId = 2, ActorName = "Johnny Depp", CharacterName = "Victor Van Dort (Voice)", PhotoUrl = "https://images.mubicdn.net/images/cast_member/1344/cache-2559-1594980649/image-w856.jpg", DisplayOrder = 1 },
            new() { MovieId = 2, ActorName = "Helena Bonham Carter", CharacterName = "Emily (Voice)", PhotoUrl = "https://images.mubicdn.net/images/cast_member/1376/cache-2591-1594980807/image-w856.jpg", DisplayOrder = 2 },
            new() { MovieId = 2, ActorName = "Emily Watson", CharacterName = "Victoria Everglot (Voice)", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2704/cache-3472-1594984242/image-w856.jpg", DisplayOrder = 3 },

            // 3. Film (Id: 3)
            new() { MovieId = 3, ActorName = "Matthew McConaughey", CharacterName = "Cooper", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2453/cache-3221-1594982987/image-w856.jpg", DisplayOrder = 1 },
            new() { MovieId = 3, ActorName = "Anne Hathaway", CharacterName = "Brand", PhotoUrl = "https://images.mubicdn.net/images/cast_member/2448/cache-3216-1594982962/image-w856.jpg", DisplayOrder = 2 }
        };

        context.MovieCasts.AddRange(casts);
        context.SaveChanges();
        Console.WriteLine(">>> CAST VERİLERİ BAŞARIYLA EKLENDİ! <<<");
    }
}
// --- GEÇİCİ CAST SEED BİTİŞİ ---


app.Run();
