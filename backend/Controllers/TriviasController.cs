using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TriviasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TriviasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/trivias/movie/1
    [HttpGet("movie/{movieId}")]
    public async Task<ActionResult<IEnumerable<MovieTrivia>>> GetTriviasByMovie(int movieId)
    {
        var trivias = await _context.MovieTrivias
            .Where(t => t.MovieId == movieId)
            .ToListAsync();

        return Ok(trivias);
    }

    // POST: api/trivias (İleride Admin Panelinden yeni anekdot eklemek için)
    [HttpPost]
    public async Task<ActionResult<MovieTrivia>> CreateTrivia(MovieTrivia trivia)
    {
        _context.MovieTrivias.Add(trivia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTriviasByMovie), new { movieId = trivia.MovieId }, trivia);
    }
}