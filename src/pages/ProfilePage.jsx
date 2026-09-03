import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  PlusCircle, 
  Star, 
  Bookmark, 
  Heart, 
  Film, 
  Trash2, 
  Calendar,
  Share2
} from 'lucide-react';
import QuickReviewModal from '../components/QuickReviewModal';
import { useMovies } from '../context/MovieContext';
import { movies } from '../data/moviesData';
import '../styles/profile.css';

// Gelecekte backend'den (GET /api/user/profile) gelecek varsayılan mock veri
const initialUserData = {
  name: "Nilay Süzer",
  username: "@nilaysuzer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
  bio: "Film enthusiast, aspiring cinephile & software developer. Nolan and Tim Burton worshipper 🎬✨",
  stats: {
    filmsWatched: 142,
    thisYear: 28,
    listsCount: 6,
    followers: 328,
    following: 195
  },
  pinnedFavorites: [
    { slug: 'dark-knight', title: 'The Dark Knight', poster: '/imgs/dk.png', year: 2008 },
    { slug: 'interstellar', title: 'Interstellar', poster: '/imgs/interstelllar.png', year: 2014 },
    { slug: 'corpse-bride', title: 'Corpse Bride', poster: '/imgs/corpseb.png', year: 2005 },
    { slug: 'matrix', title: 'Matrix', poster: '/imgs/matrix.png', year: 1999 }
  ],
  reviews: [
    {
      id: 1,
      slug: 'dark-knight',
      movieTitle: 'The Dark Knight',
      poster: '/imgs/dk.png',
      rating: 5,
      date: '2 gün önce',
      comment: "Sinema tarihinin en ikonik kötü karakter performansına sahip başyapıt. Her izleyişimde detaylar daha da parlıyor."
    },
    {
      id: 2,
      slug: 'corpse-bride',
      movieTitle: 'Corpse Bride',
      poster: '/imgs/corpseb.png',
      rating: 4.5,
      date: '1 hafta önce',
      comment: "Stop-motion tekniğinin zirvesi. Gotik ve melankolik atmosferi müzikleriyle birleşince büyüleyici oluyor."
    }
  ],
  watchlist: [
    { slug: 'tenet', title: 'Tenet', poster: '/imgs/tenet.png', year: 2020 },
    { slug: 'up', title: 'Up', poster: '/imgs/up.png', year: 2009 },
    { slug: 'coco', title: 'Coco', poster: '/imgs/coco.png', year: 2017 },
    { slug: 'inception', title: 'Inception', poster: '/imgs/inc.png', year: 2010 }
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'watchlist' | 'likes'
  const [userData, setUserData] = useState(initialUserData);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { watchlist, likedMovies, userReviews, deleteReview } = useMovies();

  // Watchlist'teki slug'ları gerçek film objelerine dönüştür:
  const watchlistMovies = movies.filter(m => watchlist.includes(m.slug));
  const likedMoviesList = movies.filter(m => likedMovies.includes(m.slug));


  // İnceleme silme (backend'de DELETE /api/reviews/:id çağrılacak yer)
  const handleDeleteReview = (id) => {
    if (window.confirm("Bu incelemeyi silmek istediğinize emin misiniz?")) {
      setUserData(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.id !== id),
        stats: { ...prev.stats, filmsWatched: prev.stats.filmsWatched - 1 }
      }));
    }
  };

  return (
    <div className="profile-container">
      {/* 1. SİNEMATİK BANNER */}
      <div className="profile-banner-wrapper">
        <img src={userData.banner} alt="Profile Banner" className="profile-banner-img" />
        <div className="banner-overlay"></div>
      </div>

      <div className="profile-content-wrap">
        {/* 2. PROFİL ÜST BİLGİ ALANI */}
        <div className="profile-header-card glass-panel">
          <div className="profile-avatar-row">
            <div className="avatar-wrapper">
              <img src={userData.avatar} alt={userData.name} className="profile-avatar" />
            </div>

            <div className="profile-actions-bar">
              <button className="profile-btn highlight-btn" onClick={() => setIsLogModalOpen(true)}>
                <PlusCircle size={18} />
                <span>+ Log / Review</span>
              </button>
              <button className="profile-btn secondary-btn" onClick={() => alert("Profil düzenleme yakında!")}>
                <Settings size={16} />
                <span>Edit Profile</span>
              </button>
              <button className="profile-btn icon-only-btn" title="Share Profile">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="profile-info">
            <h1 className="user-name">{userData.name}</h1>
            <span className="user-handle">{userData.username}</span>
            <p className="user-bio">{userData.bio}</p>

            {/* İstatistikler */}
            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-val">{userData.stats.filmsWatched}</span>
                <span className="stat-lbl">Films</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{userData.stats.thisYear}</span>
                <span className="stat-lbl">This Year</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{userData.stats.listsCount}</span>
                <span className="stat-lbl">Lists</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{userData.stats.followers}</span>
                <span className="stat-lbl">Followers</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{userData.stats.following}</span>
                <span className="stat-lbl">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PINNED FAVORITES (SABİTLENMİŞ 4 FAVORİ) */}
        <div className="pinned-section">
          <div className="section-title-row">
            <h3>📌 Favorite Masterpieces</h3>
            <span className="sub-hint">Pinned to Profile</span>
          </div>

          <div className="pinned-grid">
            {userData.pinnedFavorites.map(film => (
              <Link to={`/movie/${film.slug}`} key={film.slug} className="pinned-card">
                <img src={film.poster} alt={film.title} />
                <div className="pinned-overlay">
                  <h4>{film.title}</h4>
                  <span>{film.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
  
         <div className="profile-stats">
      <div className="stat-box">
        <span className="stat-val">{userData.stats.filmsWatched}</span>
        <span className="stat-lbl">İncelenen</span>
      </div>
      <div className="stat-box">
        <span className="stat-val">{userData.stats.watchlistCount}</span>
        <span className="stat-lbl">Watchlist</span>
      </div>
      <div className="stat-box">
        <span className="stat-val">{userData.stats.likesCount}</span>
        <span className="stat-lbl">Beğenilen</span>
      </div>
      <div className="stat-box">
        <span className="stat-val">{userData.stats.followers}</span>
        <span className="stat-lbl">Takipçi</span>
      </div>
    </div>
        

        {/* 4. SEKMELİ İÇERİK BÖLÜMÜ (TABS) */}
        <div className="profile-tabs-bar">
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={17} />
            My Reviews ({userData.reviews.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <Bookmark size={17} />
            Watchlist ({userData.watchlist.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <Heart size={17} />
            Likes
          </button>
        </div>

        {/* TAB İÇERİKLERİ */}
        <div className="tab-body">
          {/* A. REVIEWS SEKME İÇERİĞİ */}
          {activeTab === 'reviews' && (
            <div className="reviews-list">
              {userData.reviews.map(item => (
                <div key={item.id} className="user-review-card glass-panel">
                  <Link to={`/movie/${item.slug}`} className="review-film-poster">
                    <img src={item.poster} alt={item.movieTitle} />
                  </Link>

                  <div className="review-film-details">
                    <div className="review-top-line">
                      <Link to={`/movie/${item.slug}`} className="review-film-name">
                        {item.movieTitle}
                      </Link>
                      <div className="review-date">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    {/* Yıldızlı Puan */}
                    <div className="review-rating-row">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          color="#f5c518" 
                          fill={i < Math.floor(item.rating) ? "#f5c518" : "none"} 
                        />
                      ))}
                      <span className="rating-num">{item.rating}/5</span>
                    </div>

                    <p className="review-text">{item.comment}</p>

                    <div className="review-card-footer">
                      <button 
                        className="delete-review-btn" 
                        onClick={() => handleDeleteReview(item.id)}
                        title="Delete review"
                      >
                        <Trash2 size={15} /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* B. WATCHLIST SEKME İÇERİĞİ */}
          {activeTab === 'watchlist' && (
            <div className="watchlist-grid">
              {userData.watchlist.map(film => (
                <div key={film.slug} className="watchlist-card glass-panel">
                  <img src={film.poster} alt={film.title} />
                  <div className="watchlist-info">
                    <div className="card-title">{film.title}</div>
                    <Link to={`/movie/${film.slug}`}>
                      <button className="watch-now-btn">Go to Movie</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* C. LIKES SEKME İÇERİĞİ */}
          {activeTab === 'likes' && (
            <div className="empty-tab-state glass-panel">
              <Heart size={42} color="#ff4757" />
              <p>Beğendiğin filmler burada listelenecektir.</p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK LOG MODALI */}
      <QuickReviewModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        lang="TR"
      />
    </div>
  );
}