import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movies, comingSoonMovies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/home.css';
import Footer from '../components/Footer';

// 1. Hero Slider Verileri
const featuredSlides = [
  {
    slug: 'dark-knight',
    title: 'The Dark Knight',
    category: 'Action',
    tag: 'Must Watch',
    bgImg: '/imgs/dk.png',
    desc: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests.'
  },
  {
    slug: 'interstellar',
    title: 'Interstellar',
    category: 'Sci-Fi',
    tag: 'Top Rated',
    bgImg: '/imgs/interstelllar.png',
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival across unknown galaxies.'
  },
  {
    slug: 'corpse-bride',
    title: 'Corpse Bride',
    category: 'Animation',
    tag: 'Classic',
    bgImg: '/imgs/corpseb.png',
    desc: 'When a shy groom practices his wedding vows in the inadvertent presence of a deceased young woman, she rises from the grave.'
  }
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Anket State Yönetimi
  const [votedOption, setVotedOption] = useState(null);
  const [pollVotes, setPollVotes] = useState({ 0: 42, 1: 18, 2: 65, 3: 29 });

  // Slider Otomasyonu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleVote = (index) => {
    if (votedOption !== null) return;
    setVotedOption(index);
    setPollVotes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const target = document.getElementById('search-results');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMovies = searchTerm.trim()
    ? movies.filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const trendingList = movies.slice(0, 6);
  const topRatedList = movies.slice(6, 12);

  const pollQuestions = [
    'The Dark Knight',
    'Inception',
    'Interstellar',
    'Tenet'
  ];

  return (
    <div className="home-wrapper">
      {/* 1. HERO SLIDER */}
      <div className="hero-slider">
        <button className="slider-arrow prev" onClick={() => setCurrentSlide(prev => (prev === 0 ? featuredSlides.length - 1 : prev - 1))}>❮</button>
        <button className="slider-arrow next" onClick={() => setCurrentSlide(prev => (prev === featuredSlides.length - 1 ? 0 : prev + 1))}>❯</button>

        {featuredSlides.map((slide, index) => (
          <div key={slide.slug} className={`slide ${index === currentSlide ? 'active' : ''}`}>
            <img className="slide-img" src={slide.bgImg} alt={slide.title} />
            <div className="slide-overlay">
              <span className="slide-badge">{slide.tag} • {slide.category}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-desc">{slide.desc}</p>
              <Link to={`/movie/${slide.slug}`}>
                <button className="search-btn">Review Movie</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="general1">
      
        {/* 3. TRENDING NOW SECTION (HORIZONTAL CAROUSEL) */}
        <section className="category-section">
          <div className="section-header-box">
            <h2 className="trending-title">🔥 Trending This Week</h2>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Swipe to explore →</span>
          </div>
          <div className="horizontal-scroll-container">
            {trendingList.map((movie, index) => (
              <div className="horizontal-card" key={movie.slug}>
                <div className="rank-badge">#{index + 1}</div>
                <img src={movie.poster} alt={movie.title} />
                <div className="card-content">
                  <div className="card-title">{movie.title}</div>
                  <Link to={`/movie/${movie.slug}`} style={{ width: '100%' }}>
                    <button style={{ backgroundColor: '#ff4757' }}>Review</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TOP RATED MASTERPIECES */}
        <section className="category-section">
          <div className="section-header-box">
            <h2 className="top-title">⭐ Top Rated Masterpieces</h2>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Critic's Choice</span>
          </div>
          <div className="horizontal-scroll-container">
            {topRatedList.map((movie) => (
              <div className="horizontal-card" key={movie.slug}>
                <img src={movie.poster} alt={movie.title} />
                <div className="card-content">
                  <div className="card-title">{movie.title}</div>
                  <Link to={`/movie/${movie.slug}`} style={{ width: '100%' }}>
                    <button style={{ backgroundColor: '#f5c518' }}>Review</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. COMING SOON RIBBONS */}
        <section className="category-section">
          <div className="section-header-box">
            <h2 style={{ color: '#f5c518' }}>🎬 Coming Soon to Theaters</h2>
          </div>
          <div className="movies--grid">
            {comingSoonMovies.map((movie) => (
              <div className="movie--card" key={movie.id}>
                <div className="ribbon" title="Coming Soon">
                  <img src="/imgs/clapperboard.png" alt="Video Camera" />
                </div>
                <img className="movie--poster" src={movie.poster} alt="Poster" />
                <div className="movie--info">
                  <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                    <button>Watch trailer</button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CATEGORY NAV BUTTONS */}
        <section className="buttons">
          <div className="button-container">
            <h2>Categories🔻</h2>
            <div className="category-nav">
              {categories.map((cat) => (
                <a key={cat.id} href={`#${cat.id}`}>
                  <button className={cat.className}>{cat.label}</button>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 7. ALL CATEGORIES & MOVIE GRIDS */}
        <div className="general2">
          {categories.map((cat) => {
            const categoryMovies = movies.filter((m) => m.category === cat.id);
            return (
              <section id={cat.id} key={cat.id} className="category-section">
                <h2 className={`category-title ${cat.className}`}>{cat.name}</h2>
                <div className="card-container">
                  {categoryMovies.map((movie) => (
                    <div className="card" key={movie.slug}>
                      <img src={movie.poster} alt={movie.title} />
                      <div className="card-content">
                        <div className="card-title">{movie.title}</div>
                        <Link to={`/movie/${movie.slug}`} style={{ width: '100%' }}>
                          <button style={{ backgroundColor: cat.color }}>Review</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* 8. INTERACTIVE SECTION: MOVIE POLL & COMMUNITY ACTIVITY */}
        <div className="dual-section-grid">
          {/* Haftalık Anket */}
          <div className="poll-box">
            <h3>📊 Weekly Movie Poll</h3>
            <p style={{ color: '#ccc', marginBottom: '15px' }}>
              Christopher Nolan'ın kariyerindeki en iyi başyapıt hangisi?
            </p>
            <div className="poll-options">
              {pollQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className={`poll-option-btn ${votedOption === idx ? 'selected' : ''}`}
                  onClick={() => handleVote(idx)}
                >
                  <span>{q}</span>
                  {votedOption !== null && <span>{pollVotes[idx]} Votes</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Topluluk Son Yorumları */}
          <div className="community-box">
            <h3>💬 Recent Community Reviews</h3>
            <div className="reviews-mini-feed">
              <div className="mini-review-card">
                <div className="mini-review-header">
                  <strong>Bruce K.</strong>
                  <span className="mini-review-movie">Batman: The Dark Knight</span>
                </div>
                <p>"I'm BATMANNNN. En iyi Gotham tasviri!"</p>
              </div>
              <div className="mini-review-card">
                <div className="mini-review-header">
                  <strong>Marvin S.</strong>
                  <span className="mini-review-movie">Interstellar</span>
                </div>
                <p>"Müzikleri ve solucan deliği sahnesi sinema tarihinin zirvesi."</p>
              </div>
              <div className="mini-review-card">
                <div className="mini-review-header">
                  <strong>Emilia C.</strong>
                  <span className="mini-review-movie">Corpse Bride</span>
                </div>
                <p>"Görsel dili ve Tim Burton estetiği kusursuz."</p>
              </div>
            </div>
          </div>
        </div>

        {/* 9. NEWSLETTER BOX */}
        <section id="newsletter" className="newsletter-card">
          <h2>📬 Movie Buffs Newsletter</h2>
          <p>Her cuma günün ve haftanın en iyi film tavsiyelerini doğrudan e-posta kutuna gönderelim.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
            <input className="newsletter-input" type="email" placeholder="Enter your email address..." required />
            <button className="newsletter-btn" type="submit">Subscribe</button>
          </form>
        </section>
      </div>

      {/* 10. FOOTER */}
      <Footer />
    </div>
  );
}