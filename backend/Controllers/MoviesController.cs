using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MoviesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/movies
    // GET: api/movies?comingSoon=true
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> GetMovies([FromQuery] bool? comingSoon = null)
    {
        var query = _context.Movies.AsQueryable();

        // Eğer ?comingSoon=true veya ?comingSoon=false gönderildiyse filtrele
        if (comingSoon.HasValue)
        {
            query = query.Where(m => m.IsComingSoon == comingSoon.Value);
        }

        var movies = await query
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(movies);
    }

    // GET: api/movies/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetMovie(int id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
        {
            return NotFound(new { message = "Film bulunamadı." });
        }

        return Ok(movie);
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult<Movie>> CreateMovie(Movie movie)
    {
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
    }

    // PUT: api/movies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMovie(int id, Movie movie)
    {
        if (id != movie.Id)
        {
            return BadRequest(new { message = "ID uyuşmuyor." });
        }

        _context.Entry(movie).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Movies.Any(e => e.Id == id))
            {
                return NotFound(new { message = "Film bulunamadı." });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/movies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound(new { message = "Silinecek film bulunamadı." });
        }

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}