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
  X, 
  Tv, 
  MessageSquare,
  Users,        
  ChevronDown,  
  ChevronUp,    
  HelpCircle, Eye, EyeOff, ThumbsUp, BarChart2, ShieldAlert
} from 'lucide-react';
import { movies } from '../data/moviesData';
import { categories } from '../data/categoriesData';
import { useMovies } from '../context/MovieContext';
import '../styles/detail.css';
import { useToast } from '../context/ToastContext';

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
 const [isSpoiler, setIsSpoiler] = useState(false);
  const [unblurredComments, setUnblurredComments] = useState({});
  const [commentVotes, setCommentVotes] = useState({});

  // Context'ten dinamik fonksiyon ve durumları alıyoruz
  const { 
    isInWatchlist, 
    toggleWatchlist, 
    isMovieLiked, 
    toggleLike,
    addReview,
    userReviews 
  } = useMovies();
 const toggleSpoilerBlur = (idx) => {
    setUnblurredComments(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleVote = (idx) => {
    setCommentVotes(prev => {
      const current = prev[idx] || 0;
      return { ...prev, [idx]: current + 1 };
    });
    showToast('İnceleme faydalı bulundu olarak işaretlendi 👍', 'info');
  };

  const movie = movies.find((m) => m.slug === slug);
  const categoryInfo = categories.find((c) => c.id === movie?.category) || {
    color: '#f5c518',
    name: 'Featured'
  };
const { showToast } = useToast();
  // Doğrudan Context üzerinden aktif durumu okuyoruz
  const isLiked = isMovieLiked(slug);
  const inWatchlist = isInWatchlist(slug);
  const triviaData = movie.trivia || [
  // Filmde özel trivia yoksa çalışan genel varsayılanlar
  {
    title: "🎬 Çekim Anekdotları & Kamera Arkası",
    content: `${movie.title} çekimlerinde pratik efektler ve özel teknikler yoğun olarak kullanıldı.`
  },
  // ...
];
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Yorum Formu State'leri
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
 const [openAccordion, setOpenAccordion] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  // Hem film verisindeki statik yorumları hem de Context'e sonradan eklenen yorumları birleştiriyoruz
  const movieContextReviews = userReviews
    .filter((r) => r.slug === slug)
    .map((r) => ({
      user: r.user || 'Sen (İncelemen)',
      text: r.comment || r.text,
      rating: r.rating,
      date: r.date || 'Az önce',
      isSpoiler: Boolean(r.isSpoiler), // 👈 İŞTE EKSİK OLAN SATIR!
      upvotes: r.upvotes || 0
    }));

  const allComments = [...movieContextReviews, ...(movie.comments || [])];

  const themeColor = categoryInfo.color;
  const dynamicBackground = `radial-gradient(circle at top right, ${themeColor}22 0%, #0d0d11 60%)`;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerUrl);
  const castList = movie.cast || [
    { name: "Christian Bale", role: "Bruce Wayne / Batman", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { name: "Heath Ledger", role: "Joker", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" },
    { name: "Gary Oldman", role: "Jim Gordon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
    { name: "Michael Caine", role: "Alfred Pennyworth", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { name: "Morgan Freeman", role: "Lucius Fox", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" }
  ];

  // Mevcut allComments dizisinden dinamik puan dağılımı çıkarımı
const totalRatedComments = allComments.filter((c) => c.rating).length;

const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
  const count = allComments.filter((c) => Number(c.rating) === star).length;
  const percentage = totalRatedComments > 0 ? Math.round((count / totalRatedComments) * 100) : 0;
  return { stars: star, count, percentage };
});

const averageCommunityScore = totalRatedComments > 0
  ? (allComments.reduce((acc, c) => acc + (Number(c.rating) || 0), 0) / totalRatedComments).toFixed(1)
  : movie.imdb || '0.0';
  
const handleCommentSubmit = (e) => {
  e.preventDefault();
  if (!newCommentName.trim() || !newCommentText.trim()) return;

  addReview({
    slug: movie.slug,
    movieTitle: movie.displayTitle || movie.title,
    poster: movie.poster,
    rating: newCommentRating,
    comment: newCommentText.trim(),
    text: newCommentText.trim(), // Hem text hem comment olarak gönderelim garanti olsun
    user: newCommentName.trim(),
    date: 'Az önce',
    isSpoiler: isSpoiler,
    upvotes: 0
  });

  setNewCommentName('');
  setNewCommentText('');
  setNewCommentRating(5);
  setIsSpoiler(false); // 👈 Formu sıfırla
  showToast('Yorumunuz başarıyla eklendi!', 'success');
};
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Film bağlantısı panoya kopyalandı! 🔗', 'success');
  };

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
          {/* Beğen Butonu (Context Toggle) */}
          <button 
            className={`action-circle-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => {toggleLike(slug);
  showToast(isLiked ? 'Beğeniyi kaldırdınız. 💔' : 'Film beğenildi! ❤️', isLiked ? 'info' : 'success');
}}
            title={isLiked ? "Beğeniyi Kaldır" : "Beğen"}
          >
            <Heart size={18} fill={isLiked ? "#ff4757" : "none"} color={isLiked ? "#ff4757" : "#fff"} />
          </button>

          {/* Watchlist Butonu (Context Toggle) */}
          <button 
            className={`action-circle-btn ${inWatchlist ? 'saved' : ''}`}
            onClick={() => {toggleWatchlist(slug);
  showToast(inWatchlist ? 'İzleme listesinden çıkarıldı.' : 'İzleme listesine eklendi!🍿', inWatchlist ? 'info' : 'success');
}}
          >
            <Bookmark size={18} fill={inWatchlist ? "#f5c518" : "none"} color={inWatchlist ? "#f5c518" : "#fff"} />
          </button>

          {/* Paylaş Butonu */}
          <button 
            className="action-circle-btn" 
            onClick={() => {
              handleShare();
            }}
            title="Filmi Paylaş"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* ANA DETAY ALANI (POSTER + BİLGİ KARTI) */}
      <div className="detail-main-layout">
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

          <div className="jump-review-bar">
            <a href="#comment-section" className="review-jump-btn" style={{ backgroundColor: themeColor }}>
              <MessageSquare size={17} />
              <span>Yorumları Oku & İnceleme Yaz</span>
            </a>
          </div>
        </div>
      </div>

      {/* GÖMÜLÜ FRAGMAN MODALI */}
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

      <section className="cast-module-container">
        <div className="section-header-title">
          <Users size={24} color="#f5c518" />
          <h2>Başrol Oyuncuları & Karakterler</h2>
        </div>
        <div className="cast-grid-large">
          {castList.map((actor, idx) => (
            <div key={idx} className="cast-card-large glass-panel">
              <div className="cast-image-wrap">
                <img src={actor.avatar} alt={actor.name} />
              </div>
              <div className="cast-info-large">
                <strong className="actor-name">{actor.name}</strong>
                <span className="character-name">{actor.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
{/* TOPLULUK PUAN DAĞILIMI (HISTOGRAM) */}
<section className="community-rating-section glass-panel">
  <div className="community-rating-left">
    <span className="community-badge">Topluluk Skoru</span>
    <div className="score-big-wrap">
      <span className="score-number">{averageCommunityScore}</span>
      <div className="score-meta">
        <div className="stars-row">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              fill={s <= Math.round(Number(averageCommunityScore)) ? '#f5c518' : 'none'}
              color="#f5c518"
            />
          ))}
        </div>
        <span className="total-votes-count">{totalRatedComments} değerlendirme</span>
      </div>
    </div>
        </div>
        

  <div className="community-histogram">
    {ratingDistribution.map((item) => (
      <div key={item.stars} className="histogram-bar-row">
        <span className="star-level">{item.stars} ★</span>
        <div className="histogram-track" title={`${item.count} oy (${item.percentage}%)`}>
          <div
            className="histogram-fill"
            style={{ width: `${item.percentage}%`, backgroundColor: themeColor || '#f5c518' }}
          ></div>
        </div>
        <span className="histogram-percent">{item.percentage}%</span>
      </div>
    ))}
  </div>
</section>
       {/* 2. ENİNE YORUM FORMU & SCROLL EDİLEBİLİR YORUM LİSTESİ */}
<section id="comment-section" className="comments-module-container">
  <div className="comments-header">
    <h2>💬 Kullanıcı İncelemeleri ({allComments.length})</h2>
    <span className="scroll-hint-pill">Aşağı kaydırarak tüm incelemeleri inceleyebilirsiniz</span>
  </div>

  {/* ENİNE / TAM GENİŞLİK YORUM YAZMA ALANI */}
  <div className="comment-form-wide glass-panel">
    <div className="form-header-line">
      <h3>Bu Filme Puan Ver & İnceleme Paylaş</h3>

      {/* Yıldız Seçimi */}
      <div className="rating-select-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
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

    <form 
      onSubmit={(e) => {
        handleCommentSubmit(e);
      }} 
      className="wide-comment-form"
    >
      <div className="wide-inputs-row">
        <div className="form-group user-input-col">
          <label>Kullanıcı Adınız:</label>
          <input
            type="text"
            placeholder="Örn: Nilay"
            value={newCommentName}
            onChange={(e) => setNewCommentName(e.target.value)}
            required
          />
        </div>

        <div className="form-group text-input-col">
          <label>İncelemeniz:</label>
          <textarea
            rows="2"
            placeholder="Film hakkındaki düşünceleriniz, yönetmenlik, sinematografi..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            required
          ></textarea>
        </div>
      </div>

      {/* Spoiler Toggle & Yayınla Butonu Alt Satırı */}
      <div className="form-bottom-actions">
        <label className="spoiler-toggle-label">
          <input
            type="checkbox"
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
          />
          <ShieldAlert size={16} color={isSpoiler ? "#ff4757" : "#888"} />
          <span style={{ color: isSpoiler ? "#ff4757" : "#aaa" }}>
            Bu inceleme sürprizbozan (spoiler) içerir
          </span>
        </label>

        <button 
          type="submit" 
          className="submit-comment-btn-inline" 
          style={{ backgroundColor: themeColor }}
        >
          <Send size={16} />
          <span>Yayınla</span>
        </button>
      </div>
    </form>
  </div>

  {/* SINIRLI YÜKSEKLİKTE İÇTEN SCROLL EDİLEBİLİR YORUM LİSTESİ */}
  <div className="comments-scroll-feed">
    {allComments.length > 0 ? (
      allComments.map((c, index) => {
        const hasSpoiler = c.isSpoiler;
        const isRevealed = unblurredComments[index];
  const commentText = c.text || c.comment;
        return (
          <div key={index} className="single-comment-card glass-panel">
            <div className="comment-card-top">
              <div className="commenter-meta">
                <strong className="commenter-name" style={{ color: themeColor }}>
                  {c.user}
                </strong>
                <span className="comment-date-tag">{c.date || 'Az önce'}</span>
                
                {/* Spoiler Rozeti */}
                {hasSpoiler && (
                  <span className="spoiler-tag-badge">
                    <ShieldAlert size={12} /> SPOILER
                  </span>
                )}
              </div>

              {c.rating && (
                <div className="comment-stars">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#f5c518" color="#f5c518" />
                  ))}
                </div>
              )}
            </div>

            {/* Yorum Metni + Spoiler Bulanıklık Kontrolü */}
            <div className="comment-text-wrapper">
              <p className={`commenter-text ${hasSpoiler && !isRevealed ? 'spoiler-blurred' : ''}`}>
                {c.text}
              </p>

              {hasSpoiler && !isRevealed && (
                <button
                  type="button"
                  className="reveal-spoiler-btn"
                  onClick={() => toggleSpoilerBlur(index)}
                >
                  <Eye size={14} />
                  <span>Spoiler'ı Göster</span>
                </button>
              )}

              {hasSpoiler && isRevealed && (
                <button
                  type="button"
                  className="hide-spoiler-btn"
                  onClick={() => toggleSpoilerBlur(index)}
                >
                  <EyeOff size={13} />
                  <span>Tekrar Gizle</span>
                </button>
              )}
            </div>

            {/* Yorum Altı: Upvote (Faydalı Buldum) Butonu */}
            <div className="comment-footer-bar">
              <button
                type="button"
                className="upvote-btn"
                onClick={() => handleVote(index)}
              >
                <ThumbsUp size={14} />
                <span>Faydalı Buldum ({commentVotes[index] || c.upvotes || 0})</span>
              </button>
            </div>
          </div>
        );
      })
    ) : (
      <div className="no-comments-box glass-panel">
        <MessageSquare size={36} color="#666" />
        <p>Henüz inceleme yazılmamış. İlk değerlendirmeyi yukarıdan sen yap!</p>
      </div>
    )}
  </div>
</section>

      {/* BENZER FİLMLER */}
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
       <section className="trivia-accordion-section">
              <div className="section-header-title">
                <HelpCircle size={22} color="#f5c518" />
                <h2>Film Hakkında Bilinmeyenler & Notlar</h2>
              </div>
              <div className="accordion-wrapper">
                {triviaData.map((item, idx) => {
                  const isOpen = openAccordion === idx;
                  return (
                    <div key={idx} className={`accordion-card glass-panel ${isOpen ? 'active' : ''}`}>
                      <button 
                        type="button" 
                        className="accordion-header-btn" 
                        onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      >
                        <span className="acc-title">{item.title}</span>
                        {isOpen ? <ChevronUp size={18} color="#f5c518" /> : <ChevronDown size={18} color="#aaa" />}
                      </button>
                      {isOpen && (
                        <div className="accordion-content">
                          <p>{item.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
    </div>
  );
}