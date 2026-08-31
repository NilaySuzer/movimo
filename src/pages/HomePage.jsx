import { useState } from 'react';
import { Link } from 'react-router-dom';
import { movies, comingSoonMovies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/home.css';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const target = document.getElementById('search-results');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMovies = searchTerm.trim()
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="general1">
      <h1>Welcome! Looking for a movie to watch?</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-box"
          type="search"
          placeholder="Search movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" type="submit">Search</button>
      </form>

      {/* Arama Sonuçları */}
      {searchTerm.trim() && (
        <section id="search-results" className="category-section">
          <h2 className="category-title">Search Results for "{searchTerm}"</h2>
          <div className="card-container">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <div key={movie.slug} className="card">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="card-content">
                    <div className="card-title">{movie.title}</div>
                    <Link to={`/movie/${movie.slug}`}>
                      <button>Review</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No movies found matching your query.</p>
            )}
          </div>
        </section>
      )}


   

      {/* Kategorilere Göre Listeleme */}
      <div className="general2">
        {categories.map((cat) => {
          const categoryMovies = movies.filter((m) => m.category === cat.id);
          return (
            <section id={cat.id} key={cat.id} className="category-section">
              <h2 className="category-title" style={{ borderColor: cat.themeColor }}>
                {cat.name}
              </h2>
              <div className="card-container">
                {categoryMovies.map((movie) => (
                  <div className="card" key={movie.slug}>
                    <img src={movie.poster} alt={movie.title} />
                    <div className="card-content">
                      <div className="card-title">{movie.title}</div>
                      <Link to={`/movie/${movie.slug}`}>
                        <button style={{ backgroundColor: cat.themeColor }}>
                          Review
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}