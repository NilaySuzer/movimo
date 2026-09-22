using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/reviews/movie/1
    [HttpGet("movie/{movieId}")]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByMovie(int movieId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.MovieId == movieId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reviews);
    }

    // POST: api/reviews
    [HttpPost]
    public async Task<ActionResult<Review>> CreateReview(Review review)
    {
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReviewsByMovie), new { movieId = review.MovieId }, review);
    }


    // GET: api/reviews/user/Nilay
    [HttpGet("user/{userName}")]
    public async Task<ActionResult<IEnumerable<object>>> GetReviewsByUser(string userName)
    {
        var cleanName = userName.Trim().ToLower();

        var reviews = await _context.Reviews
            .Where(r => r.User.ToLower().Contains(cleanName) || cleanName.Contains(r.User.ToLower()))
            .OrderByDescending(r => r.CreatedAt)
            .Join(_context.Movies,
                review => review.MovieId,
                movie => movie.Id,
                (review, movie) => new
                {
                    id = review.Id,
                    movieId = review.MovieId,
                    movieTitle = movie.Title,
                    poster = movie.PosterUrl ?? "/imgs/default.png",
                    comment = review.Comment,
                    rating = review.Rating,
                    createdAt = review.CreatedAt,
                    isSpoiler = review.IsSpoiler,
                    upvotes = review.Upvotes
                })
            .ToListAsync();

        return Ok(reviews);
    }

    // DELETE: api/reviews/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound(new { message = "İnceleme bulunamadı." });
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    // POST: api/reviews/5/upvote
    [HttpPost("{id}/upvote")]
    public async Task<IActionResult> UpvoteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound(new { message = "İnceleme bulunamadı." });
        }

        review.Upvotes += 1;
        await _context.SaveChangesAsync();

        return Ok(new { upvotes = review.Upvotes });
    }
}
