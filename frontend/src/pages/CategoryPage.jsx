import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Film } from 'lucide-react';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/categoryPage.css';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categories.find((c) => c.id === categoryId);
  const categoryMovies = movies.filter((m) => m.category === categoryId);

  const themeColor = category?.color || '#f5c518';

  return (
    <div className="category-page-wrapper">
      <div className="category-top-bar">
        <button className="back-btn glass-panel" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Ana Sayfa</span>
        </button>
      </div>

      <header className="category-header">
        <span className="category-badge" style={{ borderColor: themeColor, color: themeColor }}>
          Kategori Arşivi
        </span>
        <h1 style={{ textShadow: `0 0 20px ${themeColor}44` }}>{category ? category.name : 'Tüm Filmler'}</h1>
        <p>Bu kategoride toplam {categoryMovies.length} yapım listeleniyor.</p>
      </header>

      <main className="category-movies-grid">
        {categoryMovies.length > 0 ? (
          categoryMovies.map((movie) => (
            <Link to={`/movie/${movie.slug}`} key={movie.slug} className="cat-movie-card glass-panel">
              <div className="card-img-wrap">
                <img src={movie.poster} alt={movie.title} />
                <span className="rating-pill">
                  <Star size={13} fill="#f5c518" color="#f5c518" /> {movie.imdb || 'N/A'}
                </span>
              </div>
              <div className="card-meta">
                <h4>{movie.title}</h4>
                <span className="genre-tag" style={{ color: themeColor }}>{category?.name}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-category glass-panel">
            <Film size={40} color="#777" />
            <p>Bu kategoride henüz listelenmiş film bulunmuyor.</p>
          </div>
        )}
      </main>

    
    </div>
  );
}