using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Username))
        {
            return BadRequest(new { message = "Tüm alanlar zorunludur." });
        }

        // Email veya Username kullanımda mı kontrol et
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email || u.Username == dto.Username);

        if (existingUser != null)
        {
            return BadRequest(new { message = "Bu e-posta veya kullanıcı adı zaten kullanımda." });
        }

        // Şifreyi güvenli şekilde hash'le (ASP.NET Core PasswordHasher)
        var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();

        var user = new User
        {
            Username = dto.Username.Trim(),
            Email = dto.Email.Trim().ToLower(),
            FullName = dto.FullName.Trim(),
            Role = "User",
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        };

        user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kayıt başarıyla oluşturuldu! ✨", userId = user.Id });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "E-posta ve şifre gereklidir." });
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (user == null)
        {
            return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
        }

        var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

        if (result == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
        }

        // Başarılı giriş (İleride JWT token dönebiliriz, şimdilik kullanıcı bilgilerini dönüyoruz)
        return Ok(new
        {
            message = "Giriş başarılı! 🎬",
            user = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.FullName,
                user.AvatarUrl,
                user.BannerUrl,
                user.PinnedFavorites,
                user.Bio,
                user.Role
            }
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "Kullanıcı bulunamadı." });

        if (!string.IsNullOrEmpty(dto.Username) && dto.Username != user.Username)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Bu kullanıcı adı zaten alınmış!" });
            }
            user.Username = dto.Username;
        }

        user.FullName = dto.FullName ?? user.FullName;
        user.Bio = dto.Bio ?? user.Bio;
        user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;
        user.BannerUrl = dto.BannerUrl ?? user.BannerUrl;
        user.PinnedFavorites = dto.PinnedFavorites ?? user.PinnedFavorites;

        await _context.SaveChangesAsync();

        return Ok(user);
    }
}