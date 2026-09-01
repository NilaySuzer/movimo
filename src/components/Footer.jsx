import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import '../styles/home.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span>🍿</span> Movimo<span className="accent-dot">.</span>com
          </div>
          <p className="footer-text">
            Sinemaseverler için özel olarak hazırlanmış, tarafsız film incelemeleri, öneriler ve topluluk alanı.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#action">Action Movies</a></li>
            <li><a href="/#scifi">Sci-Fi Classics</a></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Community</h4>
          <ul>
            <li><Link to="/watchlist">My Watchlist</Link></li>
            <li><Link to="/my-reviews">Recent Reviews</Link></li>
            <li><a href="mailto:contact@movie.com">Support</a></li>
            <li><a href="#newsletter">Weekly Digest</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-links">
            <span className="social-badge">Letterboxd</span>
            <span className="social-badge">IMDb</span>
            <span className="social-badge">Instagram</span>
            <span className="social-badge">GitHub</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Movie.com. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}