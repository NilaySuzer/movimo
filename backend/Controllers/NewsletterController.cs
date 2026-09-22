using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsletterController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/newsletter/subscribe
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Lütfen geçerli bir e-posta adresi girin." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var exists = await _context.NewsletterSubscribers
            .AnyAsync(s => s.Email == normalizedEmail);

        if (exists)
        {
            return Conflict(new { message = "Bu e-posta adresi zaten bültene kayıtlı!" });
        }

        var subscriber = new NewsletterSubscriber
        {
            Email = normalizedEmail
        };

        _context.NewsletterSubscribers.Add(subscriber);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Bültene başarıyla abone oldunuz! 🎬" });
    }

    // GET: api/newsletter/subscribers (İleride Admin panelinde listelemek için)
    [HttpGet("subscribers")]
    public async Task<IActionResult> GetSubscribers()
    {
        var list = await _context.NewsletterSubscribers
            .OrderByDescending(s => s.SubscribedAt)
            .ToListAsync();

        return Ok(list);
    }
}

public class SubscribeRequest
{
    public string Email { get; set; } = string.Empty;
}