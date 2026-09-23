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
import { categories } from '../data/categoriesData';
import { useMovies } from '../context/MovieContext';
import '../styles/detail.css';
import { useToast } from '../context/ToastContext';

export default function MovieDetail() {
  const { slug } = useParams(); // URL'deki id veya slug (örneğin '1')
  const navigate = useNavigate();
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [unblurredComments, setUnblurredComments] = useState({});

  // API'den gelen dinamik film ve yorum state'leri
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  // Context'ten dinamik fonksiyon ve durumlar
  const { 
    isInWatchlist, 
    toggleWatchlist, 
    isMovieLiked, 
    toggleLike
  } = useMovies();
  const { showToast } = useToast();

  // 1. .NET API'DEN FİLMİ VE YORUMLARI ÇEK
 useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    // 1. Önce filmi çek (ana veri)
    fetch(`http://localhost:5080/api/movies/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Film API yanıt vermedi');
        return res.json();
      })
      .then(async (movieData) => {
        // 2. Yorumları çek (hata alsa da filmi patlatmasın)
        let reviewsData = [];
        try {
          const revRes = await fetch(`http://localhost:5080/api/reviews/movie/${movieData.id}`);
          if (revRes.ok) reviewsData = await revRes.json();
        } catch (e) {
          console.warn('Yorumlar çekilemedi:', e);
        }

        // 3. Trivia verilerini çek (hata alsa da filmi patlatmasın)
        let triviasData = [];
        try {
          const trivRes = await fetch(`http://localhost:5080/api/trivias/movie/${movieData.id}`);
          if (trivRes.ok) triviasData = await trivRes.json();
        } catch (e) {
          console.warn('Trivia çekilemedi:', e);
        }

        const formatted = {
          ...movieData,
          slug: movieData.id.toString(),
          poster: movieData.posterUrl || '/imgs/default.png',
          displayTitle: movieData.title,
          description: movieData.summary,
          imdb: movieData.averageRating || '8.5',
          category: movieData.category || 'sci-fi',
          trailerUrl: movieData.trailerUrl || 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
          watchUrl: movieData.watchUrl || 'https://www.plex.tv',
          cast: movieData.cast || [
            { name: "Matthew McConaughey", role: "Cooper", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
            { name: "Anne Hathaway", role: "Brand", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
          ],
          trivia: triviasData
        };

        setMovie(formatted);
        setComments(reviewsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Film yüklenirken hata:', err);
        setMovie(null);
        setLoading(false);
      });
  }, [slug]);

  const toggleSpoilerBlur = (idx) => {
    setUnblurredComments(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 2. YORUM BEĞENME (UPVOTE) API ÇAĞRISI
  const handleVote = async (reviewId, idx) => {
    try {
      const res = await fetch(`http://localhost:5080/api/reviews/${reviewId}/upvote`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Upvote başarısız');

      setComments(prev =>
        prev.map((c, i) => (i === idx ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c))
      );
      showToast('İnceleme faydalı bulundu olarak işaretlendi 👍', 'info');
    } catch (err) {
      console.error(err);
    }
  };
  const { currentUser } = useMovies();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);

  if (loading) {
    return (
      <div className="detail-page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <h2>Film Detayları Yükleniyor...</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-not-found glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>
        <h2>Film Bulunamadı!</h2>
        <button className="detail-btn" onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

const categoryInfo = categories.find(
    (c) => c.id?.toLowerCase() === movie?.category?.toLowerCase()
  ) || {
    color: '#f5c518',
    name: 'Featured'
  };

  const themeColor = categoryInfo.color || '#f5c518';

  // Eğer renk hex değilse veya bozulmasın diye güvenli radial background:
  const dynamicBackground = themeColor.startsWith('#')
    ? `radial-gradient(circle at top right, ${themeColor.slice(0, 7)}22 0%, #0d0d11 60%)`
    : `radial-gradient(circle at top right, rgba(245, 197, 24, 0.15) 0%, #0d0d11 60%)`;

  const isLiked = isMovieLiked(slug);
  const inWatchlist = isInWatchlist(slug);
  const triviaData = movie.trivia;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerUrl);
  const castList = movie.cast;

  // Dinamik Skor ve Histogram
  const totalRatedComments = comments.filter((c) => c.rating).length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = comments.filter((c) => Number(c.rating) === star).length;
    const percentage = totalRatedComments > 0 ? Math.round((count / totalRatedComments) * 100) : 0;
    return { stars: star, count, percentage };
  });

  const averageCommunityScore = totalRatedComments > 0
    ? (comments.reduce((acc, c) => acc + (Number(c.rating) || 0), 0) / totalRatedComments).toFixed(1)
    : movie.imdb || '0.0';

// 3. YORUM EKLEME (POST) API ÇAĞRISI
 // 3. YORUM EKLEME (POST) API ÇAĞRISI
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText || !newCommentText.trim()) return;

    // Aktif kullanıcının adı, yoksa elle girilen ad, o da yoksa varsayılan isim
    const author = (currentUser && currentUser.name) 
      ? currentUser.name 
      : (typeof newCommentName !== 'undefined' && newCommentName.trim() ? newCommentName.trim() : "Nilay Süzer");

    const payload = {
      movieId: parseInt(slug, 10),
      user: author,
      comment: newCommentText.trim(),
      rating: Number(newCommentRating) || 5,
      isSpoiler: Boolean(isSpoiler),
      upvotes: 0
    };

    try {
      const res = await fetch('http://localhost:5080/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend hata yanıtı:', errorText);
        throw new Error('Yorum eklenemedi');
      }

      const savedReview = await res.json();

      setComments((prev) => [savedReview, ...prev]);
      if (typeof setNewCommentName === 'function') setNewCommentName('');
      setNewCommentText('');
      setNewCommentRating(5);
      setIsSpoiler(false);
      showToast('Yorumunuz başarıyla eklendi!', 'success');
    } catch (err) {
      console.error('Yorum gönderme hatası:', err);
      showToast('Yorum kaydedilirken bir hata oluştu.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Film bağlantısı panoya kopyalandı! 🔗', 'success');
  };

  return (
    <div className="detail-page-wrapper" style={{ background: dynamicBackground }}>
      {/* ÜST GEZİNTİ VE AKSİYONLAR */}
      <div className="detail-top-nav">
        <button 
          className="back-btn glass-panel" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Geri Dön</span>
        </button>

        <div className="detail-actions-cluster">
          <button 
            className={`action-circle-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => {
              toggleLike(slug);
              showToast(isLiked ? 'Beğeniyi kaldırdınız. 💔' : 'Film beğenildi! ❤️', isLiked ? 'info' : 'success');
            }}
            title={isLiked ? "Beğeniyi Kaldır" : "Beğen"}
          >
            <Heart size={18} fill={isLiked ? "#ff4757" : "none"} color={isLiked ? "#ff4757" : "#fff"} />
          </button>

          <button 
            className={`action-circle-btn ${inWatchlist ? 'saved' : ''}`}
            onClick={() => {
              toggleWatchlist(slug);
              showToast(inWatchlist ? 'İzleme listesinden çıkarıldı.' : 'İzleme listesine eklendi!🍿', inWatchlist ? 'info' : 'success');
            }}
          >
            <Bookmark size={18} fill={inWatchlist ? "#f5c518" : "none"} color={inWatchlist ? "#f5c518" : "#fff"} />
          </button>

          <button 
            className="action-circle-btn" 
            onClick={handleShare}
            title="Filmi Paylaş"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* ANA DETAY ALANI */}
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
          <p style={{ color: '#aaa', margin: '-10px 0 15px 0' }}>Yönetmen: {movie.director} • {movie.releaseYear}</p>

          <div className="movie-synopsis-box">
            <h3>Film Özeti</h3>
            <p>{movie.description || 'Bu film için henüz detaylı açıklama eklenmemiş.'}</p>
          </div>

          <div className="jump-review-bar">
            <a href="#comment-section" className="review-jump-btn" style={{ backgroundColor: themeColor === '#f5c518' ? '#000' : '#fff'}}>
              <MessageSquare size={17} />
              <span>Yorumları Oku & İnceleme Yaz</span>
            </a>
          </div>
        </div>
      </div>

      {/* FRAGMAN MODALI */}
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

      {/* OYUNCU LİSTESİ */}
{((movie.cast && movie.cast.length > 0) || (typeof castList !== 'undefined' && castList?.length > 0)) && (
  <section className="cast-module-container">
    <div className="section-header-title">
      <Users size={24} color="#f5c518" />
      <h2>Başrol Oyuncuları & Karakterler</h2>
    </div>
    <div className="cast-grid-large">
      {(movie.cast || castList).map((actor, idx) => {
        // API (actorName, photoUrl, characterName) ve eski statik yapıyı (name, avatar, role) eşleştiriyoruz:
        const name = actor.actorName || actor.name || 'Oyuncu';
        const role = actor.characterName || actor.role || '';
        const avatar = actor.photoUrl || actor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

        return (
          <div key={actor.id || idx} className="cast-card-large glass-panel">
            <div className="cast-image-wrap">
              <img 
                src={avatar} 
                alt={name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <div className="cast-info-large">
              <strong className="actor-name">{name}</strong>
              <span className="character-name">{role}</span>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}

      {/* PUAN DAĞILIMI */}
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

      {/* YORUM YAZMA VE LİSTESİ */}
      <section id="comment-section" className="comments-module-container">
        <div className="comments-header">
          <h2>💬 Kullanıcı İncelemeleri ({comments.length})</h2>
          <span className="scroll-hint-pill">Aşağı kaydırarak tüm incelemeleri inceleyebilirsiniz</span>
        </div>

        <div className="comment-form-wide glass-panel">
          <div className="form-header-line">
            <h3>Bu Filme Puan Ver & İnceleme Paylaş</h3>
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

          <form onSubmit={handleCommentSubmit} className="wide-comment-form">
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

        <div className="comments-scroll-feed">
          {comments.length > 0 ? (
            comments.map((c, index) => {
              const hasSpoiler = c.isSpoiler;
              const isRevealed = unblurredComments[index];
              return (
                <div key={c.id || index} className="single-comment-card glass-panel">
                  <div className="comment-card-top">
                    <div className="commenter-meta">
                      <strong className="commenter-name" style={{ color: themeColor }}>
                        {c.user}
                      </strong>
                      <span className="comment-date-tag">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('tr-TR') : (c.date || 'Az önce')}
                      </span>
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

                  <div className="comment-text-wrapper">
                    <p className={`commenter-text ${hasSpoiler && !isRevealed ? 'spoiler-blurred' : ''}`}>
                      {c.comment || c.text}
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

                  <div className="comment-footer-bar">
                    <button
                      type="button"
                      className="upvote-btn"
                      onClick={() => handleVote(c.id, index)}
                    >
                      <ThumbsUp size={14} />
                      <span>Faydalı Buldum ({c.upvotes || 0})</span>
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

      {/* TRIVIA / BİLİNMEYENLER */}
      <section className="trivia-accordion-section">
        <div className="section-header-title">
          <HelpCircle size={22} color="#f5c518" />
          <h2>Film Hakkında Bilinmeyenler & Notlar</h2>
        </div>
        <div className="accordion-wrapper">
          {triviaData && triviaData.length > 0 ? (
            triviaData.map((item, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div key={item.id || idx} className={`accordion-card glass-panel ${isOpen ? 'active' : ''}`}>
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
            })
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic', padding: '1rem' }}>
              Bu film için henüz kamera arkası notu eklenmemiş.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}