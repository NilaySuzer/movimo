import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

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