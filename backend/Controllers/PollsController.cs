using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PollsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PollsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/polls
    [HttpGet]
    public async Task<IActionResult> GetPollOptions()
    {
        var options = await _context.PollOptions.ToListAsync();
        return Ok(options);
    }

    // POST: api/polls/vote/1
    [HttpPost("vote/{id}")]
    public async Task<IActionResult> Vote(int id)
    {
        var option = await _context.PollOptions.FindAsync(id);
        if (option == null)
        {
            return NotFound(new { message = "Seçenek bulunamadı." });
        }

        option.Votes += 1;
        await _context.SaveChangesAsync();

        return Ok(option);
    }
}