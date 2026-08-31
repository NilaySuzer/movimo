import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/detail.css';

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.slug === slug);
  const categoryInfo = categories.find((c) => c.id === movie?.category) || {
    themeColor: '#f5c518',
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Movie not found!</h2>
        <Link to="/" style={{ color: '#f5c518' }}>Back to Home</Link>
      </div>
    );
  }

  const themeColor = categoryInfo.themeColor;
  const gradientBg = `linear-gradient(to bottom, black, ${themeColor}33, black, black)`;

  return (
    <div className="detail-page-container" style={{ backgroundImage: gradientBg }}>
      {/* Üst Buton Menüsü */}
      <div className="detail-nav-header">
        <div className="detail-actions">
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => alert('🎥 Click OK to be redirected to trailer')}
            >
              <button className="detail-btn" style={{ backgroundColor: themeColor }}>
                Official Trailer
              </button>
            </a>
          )}
          <a href="#comment">
            <button className="detail-btn" style={{ backgroundColor: themeColor }}>
              Comments
            </button>
          </a>
          {movie.watchUrl && (
            <a
              href={movie.watchUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => alert('🎥 You will be redirected to watch provider')}
            >
              <button className="detail-btn" style={{ backgroundColor: themeColor }}>
                Watch Now
              </button>
            </a>
          )}
        </div>

        <button
          className="detail-btn"
          style={{ backgroundColor: themeColor }}
          onClick={() => navigate(`/#${movie.category}`)}
        >
          Back
        </button>
      </div>

      {/* Film Detay Alanı */}
      <div className="detail-content">
        <div className="movie-poster-box">
          <img src={movie.poster} alt={movie.title} />
        </div>

        <div className="movie-info-box">
          <h2>{movie.displayTitle || movie.title}</h2>
          <div className="imdb" style={{ color: themeColor }}>
            IMDb: {movie.imdb || 'N/A'}
          </div>
          <p>{movie.description || 'No description available for this movie yet.'}</p>
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <section id="comment" className="comments-section">
        <h3>User Comments</h3>
        {movie.comments && movie.comments.length > 0 ? (
          movie.comments.map((comment, index) => (
            <div className="comment-card" key={index}>
              <strong style={{ color: themeColor }}>{comment.user}</strong>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <div className="comment-card">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </section>
    </div>
  );
}