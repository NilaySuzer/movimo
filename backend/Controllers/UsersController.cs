using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Kullanıcı profilini getir: GET api/users/profile
    [HttpGet("profile")]
    public async Task<ActionResult<User>> GetProfile()
    {
        var user = await _context.Users.FirstOrDefaultAsync();
        if (user == null)
        {
            // Veritabanında ilk kullanıcı yoksa varsayılanı oluşturalım
            user = new User
            {
                Name = "Nilay Süzer",
                Username = "@nilaysuzer",
                Email = "nilay@example.com",
                Bio = "Film enthusiast, aspiring cinephile & software developer. Nolan and Tim Burton worshipper 🎬✨",
                Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                Banner = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
                PinnedFavorites = "1,2,3,4" // Virgülle ayrılmış film ID'leri
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return Ok(user);
    }

    // 2. Kullanıcı profilini ve favorileri güncelle: PUT api/users/profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] User updated)
    {
        var user = await _context.Users.FirstOrDefaultAsync();
        if (user == null)
        {
            user = new User();
            _context.Users.Add(user);
        }

        user.Name = updated.Name ?? user.Name;
        user.Bio = updated.Bio ?? user.Bio;
        user.Avatar = updated.Avatar ?? user.Avatar;
        user.Banner = updated.Banner ?? user.Banner;
        user.PinnedFavorites = updated.PinnedFavorites ?? user.PinnedFavorites;

        await _context.SaveChangesAsync();
        return Ok(user);
    }
}