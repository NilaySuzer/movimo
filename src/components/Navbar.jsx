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
  Globe
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
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moodDropdown, setMoodDropdown] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 1. Dil (TR / EN) State
  const [lang, setLang] = useState('EN');

  // 2. Cinema Mode (Işıkları Kapat) State
  const [cinemaMode, setCinemaMode] = useState(false);

  // Arama State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeAll = () => {
    setIsOpen(false);
    setCategoryDropdown(false);
    setAccountDropdown(false);
    setNotificationsOpen(false);
    setMoodDropdown(false);
    setIsSearchOpen(false);
  };

  // Cinema mode sınıfını gövdeye uygula
  useEffect(() => {
    if (cinemaMode) {
      document.body.classList.add('cinema-mode');
    } else {
      document.body.classList.remove('cinema-mode');
    }
  }, [cinemaMode]);

  // Dışarı tıklama kontrolü
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <nav className={`portfolio-navbar ${cinemaMode ? 'navbar-cinema' : ''}`}>
        <div className="navbar-container">
          {/* LOGO */}
          <Link to="/" className="nav-logo" onClick={closeAll}>
            <Clapperboard className="logo-svg" size={26} color="#f5c518" />
            <span className="logo-text">MOVIMO<span className="accent-dot">.</span>com</span>
          </Link>

          {/* CANLI ARAMA ÇUBUĞU */}
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

          {/* MOBIL MENÜ TOGGLE */}
          <div className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
          </div>

          {/* NAVİGASYON LİNKLERİ & MODÜLLER */}
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            {/* 1. Categories Dropdown */}
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <span className="nav-links dropdown-trigger">
                {lang === 'TR' ? 'Kategoriler' : 'Categories'} <ChevronDown size={14} />
              </span>
              {categoryDropdown && (
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

            {/* 2. Mood / Ne Hissediyorsun? Dropdown */}
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setMoodDropdown(true)}
              onMouseLeave={() => setMoodDropdown(false)}
            >
              <span className="nav-links dropdown-trigger highlight-mood">
                <Smile size={16} color="#f5c518" />
                {lang === 'TR' ? 'Mood' : 'Moods'} <ChevronDown size={14} />
              </span>
              {moodDropdown && (
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

            {/* 3. Watchlist */}
            <li className="nav-item">
              <Link to="/watchlist" className="nav-links" onClick={closeAll}>
                <Bookmark size={16} />
                <span className="hide-mobile">{lang === 'TR' ? 'Listem' : 'Watchlist'}</span>
                <span className="nav-badge">4</span>
              </Link>
            </li>

            {/* 4. Surprise Me (Rastgele Film) */}
            <li className="nav-item">
              <button className="surprise-btn" onClick={handleRandomMovie} title={lang === 'TR' ? 'Rastgele film öner!' : 'Surprise movie!'}>
                <Dices size={16} />
                <span>{lang === 'TR' ? 'Öner' : 'Surprise'}</span>
              </button>
            </li>

            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setNotificationsOpen(true)}
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="icon-action-btn">
                <Bell size={18} />
                <span className="notification-dot"></span>
              </div>
              {notificationsOpen && (
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

            {/* 7. Cinema Mode (Lights Off) Toggle */}
            <li className="nav-item">
              <button 
                className={`icon-action-btn ${cinemaMode ? 'cinema-active' : ''}`}
                onClick={() => setCinemaMode(!cinemaMode)}
                title={cinemaMode ? 'Turn Lights ON' : 'Cinema Mode (Lights OFF)'}
              >
                {cinemaMode ? <Sun size={17} color="#f5c518" /> : <Moon size={17} />}
              </button>
            </li>

            {/* 8. TR / EN Dil Seçici */}
            <li className="nav-item">
              <button 
                className="lang-badge-btn" 
                onClick={() => setLang(lang === 'EN' ? 'TR' : 'EN')}
                title="Switch Language"
              >
                <Globe size={14} />
                <span>{lang}</span>
              </button>
            </li>

            {/* 9. Profil & Hesap Menüsü */}
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setAccountDropdown(true)}
              onMouseLeave={() => setAccountDropdown(false)}
            >
              <div className="account-trigger">
                <div className="avatar-circle">FN</div>
                <ChevronDown size={13} color="#aaa" />
              </div>

              {accountDropdown && (
                <ul className="dropdown-menu account-menu glass-panel">
                  <li>
                    <Link to="/profile" className="dropdown-link" onClick={closeAll}>
                      <User size={15} /> {lang === 'TR' ? 'Profilim' : 'My Profile'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-reviews" className="dropdown-link" onClick={closeAll}>
                      <Star size={15} /> {lang === 'TR' ? 'İncelemelerim' : 'My Reviews'}
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

      {/* MODAL */}
      <QuickReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        lang={lang} 
      />
    </>
  );
}