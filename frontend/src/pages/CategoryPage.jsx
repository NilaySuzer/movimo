import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Film, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/categoryPage.css';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Sıralama ve Filtreleme State'leri
  const [sortBy, setSortBy] = useState('rating-desc');
  const [minRating, setMinRating] = useState(0);

  const category = (categories || []).find((c) => c.id === categoryId);
  const themeColor = category?.color || '#f5c518';

  // 1. Kategori filmlerini güvenli çekme
  const categoryMovies = useMemo(() => {
    return (movies || []).filter(
      (m) => m?.category?.toLowerCase() === categoryId?.toLowerCase()
    );
  }, [categoryId]);

  // 2. Sıralama ve Puan Filtreleme Mantığı
  const filteredMovies = useMemo(() => {
    return categoryMovies
      .filter((m) => (parseFloat(m?.imdb) || 0) >= minRating)
      .sort((a, b) => {
        if (sortBy === 'rating-desc') {
          return (parseFloat(b?.imdb) || 0) - (parseFloat(a?.imdb) || 0);
        }
        if (sortBy === 'year-desc') {
          return (parseInt(b?.year) || 0) - (parseInt(a?.year) || 0);
        }
        if (sortBy === 'title-asc') {
          return (a?.title || '').localeCompare(b?.title || '');
        }
        return 0;
      });
  }, [categoryMovies, sortBy, minRating]);

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
        <h1 style={{ textShadow: `0 0 20px ${themeColor}44` }}>
          {category ? category.name : 'Tüm Filmler'}
        </h1>
        <p>Bu kategoride toplam {categoryMovies.length} yapım listeleniyor.</p>
      </header>

      {/* FİLTRELEME & SIRALAMA ÇUBUĞU */}
      <div className="catalog-controls-bar glass-panel">
        <div className="control-group">
          <ArrowUpDown size={16} color={themeColor} />
          <label htmlFor="sort-select">Sırala:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cinema-select"
          >
            <option value="rating-desc">En Yüksek Puan (IMDb)</option>
            <option value="year-desc">En Yeni Yapımlar</option>
            <option value="title-asc">Alfabetik (A-Z)</option>
          </select>
        </div>

        <div className="control-group slider-group">
          <SlidersHorizontal size={16} color={themeColor} />
          <label>
            Min. IMDb: <strong className="rating-val-badge" style={{ color: themeColor }}>{minRating > 0 ? `${minRating}+` : 'Tümü'}</strong>
          </label>
          <input
            type="range"
            min="0"
            max="9"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="cinema-slider"
            style={{ accentColor: themeColor }}
          />
        </div>

        <span className="results-badge">
          {filteredMovies.length} film gösteriliyor
        </span>
      </div>

      <main className="category-movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Link to={`/movie/${movie.slug}`} key={movie.slug} className="cat-movie-card glass-panel">
              <div className="card-img-wrap">
                <img src={movie.poster} alt={movie.title} />
                <span className="rating-pill">
                  <Star size={13} fill="#f5c518" color="#f5c518" /> {movie.imdb || 'N/A'}
                </span>
              </div>
              <div className="card-meta">
                <h4>{movie.title}</h4>
                <span className="genre-tag" style={{ color: themeColor }}>
                  {category?.name || movie.category}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-category glass-panel">
            <Film size={40} color="#777" />
            <p>
              {categoryMovies.length > 0
                ? 'Seçilen kriterlere uygun film bulunamadı.'
                : 'Bu kategoride henüz listelenmiş film bulunmuyor.'}
            </p>
            {categoryMovies.length > 0 && (
              <button
                onClick={() => setMinRating(0)}
                className="reset-filter-btn"
                style={{ backgroundColor: themeColor }}
              >
                Filtreyi Sıfırla
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}