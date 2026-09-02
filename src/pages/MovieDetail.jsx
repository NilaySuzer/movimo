import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Bookmark, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Star, 
  Send, 
  Film, 
  X, 
  Tv, 
  Calendar,
  MessageSquare
} from 'lucide-react';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import '../styles/detail.css';

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.slug === slug);
  const categoryInfo = categories.find((c) => c.id === movie?.category) || {
    color: '#f5c518',
    name: 'Featured'
  };

  // State'ler
  const [isLiked, setIsLiked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Yorum State'leri
  const [commentsList, setCommentsList] = useState(movie?.comments || []);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (movie) {
      setCommentsList(movie.comments || []);
    }
  }, [slug, movie]);

  if (!movie) {
    return (
      <div className="movie-not-found glass-panel">
        <h2>Film Bulunamadı!</h2>
        <button className="detail-btn" onClick={() => navigate('/')}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const themeColor = categoryInfo.color;
  const dynamicBackground = `radial-gradient(circle at top right, ${themeColor}22 0%, #0d0d11 60%)`;

  // YouTube Linkinden Embed ID çıkarma fonksiyonu
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` 
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerUrl);

  // Yorum Gönderme Fonksiyonu
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newCommentObj = {
      user: newCommentName.trim(),
      text: newCommentText.trim(),
      rating: newCommentRating,
      date: 'Az önce'
    };

    setCommentsList([newCommentObj, ...commentsList]);
    setNewCommentName('');
    setNewCommentText('');
    setNewCommentRating(5);
  };

  // Paylaşım Butonu
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Film bağlantısı panoya kopyalandı! 🔗');
  };

  // Benzer Filmler (Aynı kategorideki diğer filmler)
  const similarMovies = movies
    .filter((m) => m.category === movie.category && m.slug !== movie.slug)
    .slice(0, 4);

  return (
    <div className="detail-page-wrapper" style={{ background: dynamicBackground }}>
      {/* ÜST GEZİNTİ VE AKSİYONLAR */}
      <div className="detail-top-nav">
        <button 
          className="back-btn glass-panel" 
          onClick={() => navigate(`/#${movie.category}`)}
        >
          <ArrowLeft size={18} />
          <span>Geri Dön</span>
        </button>

        <div className="detail-actions-cluster">
          {/* Beğen Butonu */}
          <button 
            className={`action-circle-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
            title="Beğen"
          >
            <Heart size={18} fill={isLiked ? "#ff4757" : "none"} color={isLiked ? "#ff4757" : "#fff"} />
          </button>

          {/* Watchlist Butonu */}
          <button 
            className={`action-circle-btn ${inWatchlist ? 'saved' : ''}`}
            onClick={() => setInWatchlist(!inWatchlist)}
            title="İzleme Listeme Ekle"
          >
            <Bookmark size={18} fill={inWatchlist ? "#f5c518" : "none"} color={inWatchlist ? "#f5c518" : "#fff"} />
          </button>

          {/* Paylaş Butonu */}
          <button 
            className="action-circle-btn" 
            onClick={handleShare}
            title="Filmi Paylaş"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* ANA DETAY ALANI (POSTER + BİLGİ KARTI) */}
      <div className="detail-main-layout">
        {/* POSTER & HIZLI İZLEME AKSİYONLARI */}
        <div className="movie-poster-card">
          <div className="poster-img-container">
            <img src={movie.poster} alt={movie.title} />
            {embedUrl && (
              <button className="play-trailer-floating" onClick={() => setIsTrailerOpen(true)}>
                <Play size={24} fill="#000" color="#000" />
                <span>Fragmanı İzle</span>
              </button>
            )}
          </div>

          <div className="stream-providers-box glass-panel">
            <span className="stream-label"><Tv size={16} /> Nereden İzlenir?</span>
            {movie.watchUrl ? (
              <a href={movie.watchUrl} target="_blank" rel="noreferrer" className="watch-now-anchor">
                Plex TV'de İzle →
              </a>
            ) : (
              <span className="stream-status">Bu film için yayın sağlayıcı henüz eklenmedi.</span>
            )}
          </div>
        </div>

        {/* BİLGİ KARTI (CAM / GLASSMORPHISM) */}
        <div className="movie-info-card glass-panel">
          <div className="movie-badge-row">
            <span className="movie-category-tag" style={{ borderColor: themeColor, color: themeColor }}>
              {categoryInfo.name}
            </span>
            <span className="movie-imdb-tag">
              <Star size={16} fill="#f5c518" color="#f5c518" />
              <span>IMDb: {movie.imdb || 'N/A'}</span>
            </span>
          </div>

          <h1 className="movie-main-title">{movie.displayTitle || movie.title}</h1>

          <div className="movie-synopsis-box">
            <h3>Film Özeti</h3>
            <p>{movie.description || 'Bu film için henüz detaylı açıklama eklenmemiş.'}</p>
          </div>

          {/* Hızlı İnceleme Yaz Butonu */}
          <div className="jump-review-bar">
            <a href="#comment-section" className="review-jump-btn" style={{ backgroundColor: themeColor }}>
              <MessageSquare size={17} />
              <span>Yorumları Oku & İnceleme Yaz</span>
            </a>
          </div>
        </div>
      </div>

      {/* GÖMÜLÜ FRAGMAN MODALI (POPUP) */}
      {isTrailerOpen && embedUrl && (
        <div className="trailer-modal-backdrop" onClick={() => setIsTrailerOpen(false)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close-btn" onClick={() => setIsTrailerOpen(false)}>
              <X size={24} />
            </button>
            <div className="iframe-responsive-container">
              <iframe
                src={embedUrl}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* YORUMLAR VE İNCELEME YAZMA ALANI */}
      <section id="comment-section" className="comments-module-container">
        <div className="comments-header">
          <h2>💬 Kullanıcı İncelemeleri ({commentsList.length})</h2>
        </div>

        <div className="comments-dual-grid">
          {/* 1. YORUM YAZMA FORMU */}
          <div className="comment-form-card glass-panel">
            <h3>Bu Filmi Puanla & Yorumla</h3>
            <form onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <label>Kullanıcı Adınız:</label>
                <input
                  type="text"
                  placeholder="Örn: Nilay"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Puanınız:</label>
                <div className="rating-select-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      className="star-selectable"
                      color={(hoverRating || newCommentRating) >= star ? '#f5c518' : '#555'}
                      fill={(hoverRating || newCommentRating) >= star ? '#f5c518' : 'none'}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewCommentRating(star)}
                    />
                  ))}
                  <span className="rating-indicator">{hoverRating || newCommentRating} / 5</span>
                </div>
              </div>

              <div className="form-group">
                <label>İncelemeniz:</label>
                <textarea
                  rows="4"
                  placeholder="Film hakkındaki düşünceleriniz, yönetmenlik, oyunculuklar..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-comment-btn" style={{ backgroundColor: themeColor }}>
                <Send size={16} />
                <span>İncelemeyi Yayınla</span>
              </button>
            </form>
          </div>

          {/* 2. YORUMLARIN LİSTESİ */}
          <div className="comments-list-feed">
            {commentsList.length > 0 ? (
              commentsList.map((c, index) => (
                <div key={index} className="single-comment-card glass-panel">
                  <div className="comment-card-top">
                    <strong className="commenter-name" style={{ color: themeColor }}>
                      {c.user}
                    </strong>
                    {c.rating && (
                      <div className="comment-stars">
                        {Array.from({ length: c.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#f5c518" color="#f5c518" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="commenter-text">{c.text}</p>
                </div>
              ))
            ) : (
              <div className="no-comments-box glass-panel">
                <MessageSquare size={36} color="#666" />
                <p>Henüz yorum yapılmamış. İlk incelemeyi sen yaz!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BENZER FİLMLER (MORE LIKE THIS) */}
      {similarMovies.length > 0 && (
        <section className="similar-movies-section">
          <div className="similar-header">
            <h2>🎯 Benzer Filmler ({categoryInfo.name})</h2>
          </div>
          <div className="similar-grid">
            {similarMovies.map((sim) => (
              <Link to={`/movie/${sim.slug}`} key={sim.slug} className="similar-card glass-panel">
                <img src={sim.poster} alt={sim.title} />
                <div className="similar-info">
                  <h4>{sim.title}</h4>
                  <span>IMDb: {sim.imdb || 'N/A'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}