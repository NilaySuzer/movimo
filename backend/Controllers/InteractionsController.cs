using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InteractionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public InteractionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/interactions/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserInteractions(int userId)
    {
        var interactions = await _context.UserInteractions
            .Where(i => i.UserId == userId)
            .ToListAsync();

        return Ok(interactions);
    }

    // POST: api/interactions/toggle-like
    [HttpPost("toggle-like")]
    public async Task<IActionResult> ToggleLike([FromBody] InteractionRequest req)
    {
        var item = await _context.UserInteractions
            .FirstOrDefaultAsync(i => i.MovieId == req.MovieId && i.UserId == req.UserId);

        if (item == null)
        {
            item = new UserInteraction
            {
                MovieId = req.MovieId,
                UserId = req.UserId,
                IsLiked = true,
                IsInWatchlist = false
            };
            _context.UserInteractions.Add(item);
        }
        else
        {
            item.IsLiked = !item.IsLiked;
            item.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(new { movieId = item.MovieId, isLiked = item.IsLiked });
    }

    // POST: api/interactions/toggle-watchlist
    [HttpPost("toggle-watchlist")]
    public async Task<IActionResult> ToggleWatchlist([FromBody] InteractionRequest req)
    {
        var item = await _context.UserInteractions
            .FirstOrDefaultAsync(i => i.MovieId == req.MovieId && i.UserId == req.UserId);

        if (item == null)
        {
            item = new UserInteraction
            {
                MovieId = req.MovieId,
                UserId = req.UserId,
                IsLiked = false,
                IsInWatchlist = true
            };
            _context.UserInteractions.Add(item);
        }
        else
        {
            item.IsInWatchlist = !item.IsInWatchlist;
            item.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(new { movieId = item.MovieId, isInWatchlist = item.IsInWatchlist });
    }
}

public class InteractionRequest
{
    public int MovieId { get; set; }
    public int UserId { get; set; }
}