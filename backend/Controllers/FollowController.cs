using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowController : ControllerBase
{
    private readonly AppDbContext _context;

    public FollowController(AppDbContext context)
    {
        _context = context;
    }

    // Takip et / Takipten çık (Toggle)
    [HttpPost]
    public async Task<IActionResult> ToggleFollow([FromBody] FollowDto dto)
    {
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == dto.FollowerId && f.FollowingId == dto.FollowingId);

        if (existingFollow != null)
        {
            _context.Follows.Remove(existingFollow);
            await _context.SaveChangesAsync();
            return Ok(new { isFollowing = false, message = "Takipten çıkıldı." });
        }
        else
        {
            var newFollow = new Follow
            {
                FollowerId = dto.FollowerId,
                FollowingId = dto.FollowingId
            };
            _context.Follows.Add(newFollow);
            await _context.SaveChangesAsync();
            return Ok(new { isFollowing = true, message = "Takip edilmeye başlandı." });
        }
    }

    // Bir kullanıcının takip ettiklerini veya takipçilerini getirmek istersen:
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserFollows(int userId)
    {
        var followers = await _context.Follows
            .Where(f => f.FollowingId == userId)
            .Select(f => f.FollowerId)
            .ToListAsync();

        var following = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();

        return Ok(new { followers, following });
    }
}