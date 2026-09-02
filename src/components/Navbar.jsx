import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clapperboard, 
  Bookmark, 
  Dices, 
  ChevronDown, 
  User, 
  Star, 
  LogOut, 
  Menu, 
  X, 
  Info, 
  Mail, 
  Bell, 
  PlusCircle, 
  Sun, 
  Moon, 
  Smile, 
    Globe,
  Film
} from 'lucide-react';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import QuickReviewModal from './QuickReviewModal';
import '../styles/navbar.css';

const moodList = [
  { id: 'mindblown', label: 'Mind-Blowing 🤯', labelTr: 'Beyin Yakan 🤯', filter: 'scifi' },
  { id: 'feelgood', label: 'Feel Good & Chill ☀️', labelTr: 'Kafa Dağıtmalık ☀️', filter: 'comedy' },
  { id: 'romantic', label: 'Emotional & Tears 🥺', labelTr: 'Duygusal / Ağlatmalık 🥺', filter: 'romantic' },
  { id: 'adrenaline', label: 'Pure Adrenaline ⚡', labelTr: 'Saf Adrenalin ⚡', filter: 'action' },
  { id: 'spooky', label: 'Spooky Vibes 🕯️', labelTr: 'Karanlık & Gerilim 🕯️', filter: 'horror' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Tek bir state ile hangi dropdown'ın açık olduğunu takip ediyoruz:
  // null | 'categories' | 'moods' | 'notifications' | 'account'
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const [cinemaMode, setCinemaMode] = useState(false);

  // Arama State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const navRef = useRef(null);
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Bir dropdown'a basıldığında açma/kapama fonksiyonu
  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  };

  // Ekranda boş bir yere tıklandığında açık menüleri kapatma
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cinema mode body sınıfı
  useEffect(() => {
    if (cinemaMode) {
      document.body.classList.add('cinema-mode');
    } else {
      document.body.classList.remove('cinema-mode');
    }
  }, [cinemaMode]);

  const filteredMovies = searchTerm.trim()
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleRandomMovie = () => {
    closeAll();
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    if (randomMovie) {
      navigate(`/movie/${randomMovie.slug}`);
    }
  };

  const handleMoodSelect = (categoryTarget) => {
    closeAll();
    navigate(`/#${categoryTarget}`);
  };

  return (
    <>
      <nav 
        className={`portfolio-navbar ${cinemaMode ? 'navbar-cinema' : ''}`}
        ref={navRef}
      >
        <div className="navbar-container">
          {/* LOGO */}
          <Link to="/" className="nav-logo" onClick={closeAll}>
            <Clapperboard className="logo-svg" size={26} color="#f5c518" />
            <span className="logo-text">MOVIMO<span className="accent-dot">.</span>com</span>
          </Link>

          {/* ARAMA ÇUBUĞU */}
          <div className="nav-search-wrapper" ref={searchRef}>
            <form className="nav-search-form" onSubmit={(e) => e.preventDefault()}>
              <Search size={16} className="nav-search-icon" color="#aaa" />
              <input
                className="nav-search-input"
                type="search"
                placeholder={lang === 'TR' ? 'Film ara...' : 'Search movie...'}
                value={searchTerm}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
              />
            </form>

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
                    {lang === 'TR' ? `"${searchTerm}" için film bulunamadı` : `No movies found for "${searchTerm}"`}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBİL TOGGLE */}
          <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
          </div>

          {/* MENÜ ELEMANLARI */}
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            
            <li className="nav-item">
  <Link 
    to="/" 
    className={`nav-links ${location.pathname === '/' ? 'active-link' : ''}`} 
    onClick={closeAll}
  >
    <span>{lang === 'TR' ? 'Ana Sayfa' : 'Home'}</span>
  </Link>
</li>
                      
            {/* 1. CATEGORIES (TIKLAMAYLA AÇILIR) */}
            <li className="nav-item dropdown">
              <button 
                type="button"
                className={`nav-links-btn ${activeDropdown === 'categories' ? 'active-link' : ''}`}
                onClick={() => toggleDropdown('categories')}
              >
                <span>{lang === 'TR' ? 'Kategoriler' : 'Categories'}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${activeDropdown === 'categories' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'categories' && (
                <ul className="dropdown-menu glass-panel">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a href={`/#${cat.id}`} className="dropdown-link" onClick={closeAll}>
                        <span className="cat-dot" style={{ backgroundColor: cat.color }}></span>
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* 2. MOODS (TIKLAMAYLA AÇILIR) */}
            <li className="nav-item dropdown">
              <button 
                type="button"
                className={`nav-links-btn highlight-mood ${activeDropdown === 'moods' ? 'active-link' : ''}`}
                onClick={() => toggleDropdown('moods')}
              >
                <Smile size={16} color="#f5c518" />
                <span>{lang === 'TR' ? 'Mood' : 'Moods'}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${activeDropdown === 'moods' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'moods' && (
                <ul className="dropdown-menu glass-panel mood-menu">
                  {moodList.map((m) => (
                    <li key={m.id}>
                      <button className="dropdown-link mood-btn" onClick={() => handleMoodSelect(m.filter)}>
                        {lang === 'TR' ? m.labelTr : m.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* 4. SURPRISE ME */}
            <li className="nav-item">
              <button className="surprise-btn" onClick={handleRandomMovie} title="Pick a random movie!">
                <Dices size={16} />
                <span>{lang === 'TR' ? 'Öner' : 'Surprise'}</span>
              </button>
            </li>


            {/* 6. BİLDİRİMLER (TIKLAMAYLA AÇILIR) */}
            <li className="nav-item dropdown">
              <button 
                type="button"
                className={`icon-action-btn ${activeDropdown === 'notifications' ? 'cinema-active' : ''}`}
                onClick={() => toggleDropdown('notifications')}
                title="Notifications"
              >
                <Bell size={18} />
                <span className="notification-dot"></span>
              </button>

              {activeDropdown === 'notifications' && (
                <div className="dropdown-menu notification-panel glass-panel">
                  <div className="notif-header">
                    <h4>{lang === 'TR' ? 'Bildirimler' : 'Notifications'}</h4>
                  </div>
                  <div className="notif-item unread">
                    <p><strong>Bruce K.</strong> {lang === 'TR' ? 'The Dark Knight yorumunu beğendi.' : 'liked your review on The Dark Knight.'}</p>
                    <span>10m ago</span>
                  </div>
                  <div className="notif-item">
                    <p>🎬 <strong>Haftanın Filmi:</strong> {lang === 'TR' ? 'Interstellar trendlere girdi!' : 'Interstellar is trending now!'}</p>
                    <span>2h ago</span>
                  </div>
                </div>
              )}
            </li>

            {/* 7. CINEMA MODE TOGGLE */}
            <li className="nav-item">
              <button 
                type="button"
                className={`icon-action-btn ${cinemaMode ? 'cinema-active' : ''}`}
                onClick={() => setCinemaMode(!cinemaMode)}
                title={cinemaMode ? 'Turn Lights ON' : 'Cinema Mode (Lights OFF)'}
              >
                {cinemaMode ? <Sun size={17} color="#f5c518" /> : <Moon size={17} />}
              </button>
            </li>

            {/* 8. LANG TOGGLE */}
            <li className="nav-item">
              <button 
                type="button"
                className="lang-badge-btn" 
                onClick={() => setLang(lang === 'EN' ? 'TR' : 'EN')}
              >
                <Globe size={14} />
                <span>{lang}</span>
              </button>
            </li>

            {/* 9. ACCOUNT (TIKLAMAYLA AÇILIR) */}
            <li className="nav-item dropdown">
              <button 
                type="button"
                className="account-trigger"
                onClick={() => toggleDropdown('account')}
              >
                <div className="avatar-circle">FN</div>
                <ChevronDown size={13} className={`dropdown-arrow ${activeDropdown === 'account' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'account' && (
                <ul className="dropdown-menu account-menu glass-panel">
                  <li>
                    <Link to="/profile" className="dropdown-link" onClick={closeAll}>
                      <User size={15} /> {lang === 'TR' ? 'Profil Sayfam' : 'My Profile'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="dropdown-link" onClick={closeAll}>
                      <Info size={15} /> {lang === 'TR' ? 'Hakkımızda' : 'About'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="dropdown-link" onClick={closeAll}>
                      <Mail size={15} /> {lang === 'TR' ? 'İletişim' : 'Contact'}
                    </Link>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <button className="dropdown-link logout-btn" onClick={() => { closeAll(); alert('Logged out!'); }}>
                      <LogOut size={15} /> {lang === 'TR' ? 'Çıkış Yap' : 'Log Out'}
                    </button>
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </nav>

      {/* QUICK LOG MODAL */}
      <QuickReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        lang={lang} 
      />
    </>
  );
}