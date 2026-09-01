import React, { useState,  useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  // Arama State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Dışarı tıklayınca arama panelini kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Canlı arama filtresi
  const filteredMovies = searchTerm.trim()
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeAll = () => {
    setIsOpen(false);
    setCategoryDropdown(false);
    setAccountDropdown(false);
  };

  // Rastgele Film Öneri Fonksiyonu (Surprise Me)
  const handleRandomMovie = () => {
    closeAll();
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    if (randomMovie) {
      navigate(`/movie/${randomMovie.slug}`);
    }
  };

  const handleLogout = () => {
    closeAll();
    alert('Logged out successfully!');
  };

  return (
    <nav className="portfolio-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeAll}>
                  <span className="logo-icon">MMM</span>
                  <span className="logo-text"> Movimo<span className="accent-dot">.</span>com </span>
        </Link>

          {/* 🔍 NAVBAR ARAMA ÇUBUĞU & CANLI SONUÇLAR */}
        <div className="nav-search-wrapper" ref={searchRef}>
          <form 
            className="nav-search-form" 
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="nav-search-icon">🔍</span>
            <input
              className="nav-search-input"
              type="search"
              placeholder="Search movie..."
              value={searchTerm}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
            />
          </form>

          {/* Canlı Arama Sonuç Paneli */}
          {isSearchOpen && searchTerm.trim() && (
            <div className="search-results-dropdown glass-panel">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <Link
                    key={movie.slug}
                    to={`/movie/${movie.slug}`}
                    className="search-result-item"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                  >
                    <img src={movie.poster} alt={movie.title} className="search-result-img" />
                    <div className="search-result-info">
                      <div className="search-result-title">{movie.title}</div>
                      <span className="search-result-meta">IMDb: {movie.imdb || 'N/A'}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-no-results">
                  No movies found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>    


        {/* Mobil Hamburger Menü */}
        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigasyon Linkleri */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {/* 1. Home */}
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-links ${location.pathname === '/' ? 'active-link' : ''}`} 
              onClick={closeAll}
            >
              Home
            </Link>
          </li>

          {/* 2. Categories Dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => setCategoryDropdown(true)}
            onMouseLeave={() => setCategoryDropdown(false)}
          >
            <span className="nav-links dropdown-trigger">
              Categories ▾
            </span>
            {categoryDropdown && (
              <ul className="dropdown-menu glass-panel">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a 
                      href={`/#${cat.id}`} 
                      className="dropdown-link" 
                      onClick={closeAll}
                    >
                      <span className="cat-dot" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* 3. Watchlist */}
          <li className="nav-item">
            <Link to="/watchlist" className="nav-links" onClick={closeAll}>
              Watchlist <span className="nav-badge">4</span>
            </Link>
          </li>

          {/* 4. Surprise Me (Random Movie) */}
          <li className="nav-item">
            <button className="surprise-btn" onClick={handleRandomMovie} title="Pick a random movie!">
              🎲 Surprise Me
            </button>
          </li>

          {/* 5. About */}
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeAll}>
              About
            </Link>
          </li>

          {/* 6. Contact Us */}
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeAll}>
              Contact Us
            </Link>
          </li>

          {/* 7. Account & Log Out Dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => setAccountDropdown(true)}
            onMouseLeave={() => setAccountDropdown(false)}
          >
            <div className="account-trigger">
              <div className="avatar-circle">FN</div>
              <span className="account-label">Account ▾</span>
            </div>

            {accountDropdown && (
              <ul className="dropdown-menu account-menu glass-panel">
                <li>
                  <Link to="/profile" className="dropdown-link" onClick={closeAll}>
                    👤 My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/my-reviews" className="dropdown-link" onClick={closeAll}>
                    ⭐ My Reviews
                  </Link>
                </li>
                <li className="divider"></li>
                <li>
                  <button className="dropdown-link logout-btn" onClick={handleLogout}>
                    🚪 Log Out
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}