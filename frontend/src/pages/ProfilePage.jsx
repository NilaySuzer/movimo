import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  PlusCircle, 
  Star, 
  Bookmark, 
  Heart, 
  Trash2, 
  Calendar,
  Share,
  Share2,
  Search,       
  UserPlus,    
  UserCheck, Sparkles,  ListPlus, Film, FolderHeart, X 
} from 'lucide-react';
import QuickReviewModal from '../components/QuickReviewModal';
import { useMovies } from '../context/MovieContext';
import { movies, movies as allMoviesData} from '../data/moviesData';
import { communityUsers } from '../data/usersData'; 
import EditProfileModal from '../components/EditProfileModal';
import FollowModal from '../components/FollowModal';
import '../styles/profile.css';
import { useToast } from '../context/ToastContext';

const initialUserData = {
  name: "Nilay Süzer",
  username: "@nilaysuzer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
  bio: "Film enthusiast, aspiring cinephile & software developer. Nolan and Tim Burton worshipper 🎬✨",
  stats: {
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
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'watchlist' | 'likes'
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState('followers');
  // Context'ten dinamik verileri alıyoruz  const { customLists, createCustomList, deleteCustomList } = useMovies();
    const { customLists = [], createCustomList, deleteCustomList } = useMovies();
  const { showToast } = useToast();
  
    // Modal State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [newListDesc, setNewListDesc] = useState('');
  
    const handleCreateList = (e) => {
      e.preventDefault();
      if (!newListTitle.trim()) return;
      
      createCustomList(newListTitle, newListDesc);
      setNewListTitle('');
      setNewListDesc('');
      setIsModalOpen(false);
      showToast('Yeni sinema listeniz oluşturuldu! 🎬', 'success');
    };
  
    const handleDeleteList = (listId, listTitle) => {
      if (window.confirm(`"${listTitle}" listesini silmek istediğinize emin misiniz?`)) {
        deleteCustomList(listId);
        showToast('Liste silindi.', 'info');
      }
    };
  
  const { watchlist, followingList, likedMovies, userReviews, currentUser, deleteReview } = useMovies();
const openFollowModal = (tabName) => {
    setFollowModalTab(tabName);
    setIsFollowModalOpen(true);
  };
  const pinnedList = (currentUser?.pinnedFavorites || ['dark-knight', 'interstellar', 'corpse-bride', 'matrix'])
    .map(slug => movies.find(m => m.slug === slug))
    .filter(Boolean);
  // Slug dizilerini gerçek film objeleriyle eşleştiriyoruz
  const watchlistMovies = movies.filter(m => watchlist.includes(m.slug));
  const likedMoviesList = movies.filter(m => likedMovies.includes(m.slug));

   const [userSearchQuery, setUserSearchQuery] = useState('');

  // Arama filtresine uyan veya takip edilmeyen önerilen kullanıcılar
  const filteredUsers = communityUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchesSearch;
  });

  // Takip önerileri (Henüz takip edilmeyenler)
  const suggestedUsers = communityUsers.filter(u => !followingList.includes(u.username)).slice(0, 3);

  const handleDeleteReview = (id) => {
    if (window.confirm("Bu incelemeyi silmek istediğinize emin misiniz?")) {
      deleteReview(id); // Doğrudan Context'ten ve LocalStorage'dan siler
    }
  };

   if (!currentUser) {
    return (
      <div className="profile-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Giriş Yapılmadı</h2>
        <p>Profilinizi görüntülemek için lütfen giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* 1. BANNER */}
      <div className="profile-banner-wrapper">
        <img src={currentUser.banner} alt="Profile Banner" className="profile-banner-img" />
        <div className="banner-overlay"></div>
      </div>

      <div className="profile-content-wrap">
        {/* 2. PROFİL ÜST KART */}
        <div className="profile-header-card glass-panel">
          <div className="profile-avatar-row">
            <div className="avatar-wrapper">
              <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
            </div>

            <div className="profile-actions-bar">
              <button className="profile-btn highlight-btn" onClick={() => setIsLogModalOpen(true)}>
                <PlusCircle size={18} />
                <span>+ Log / Review</span>
              </button>
              <button className="profile-btn secondary-btn" onClick={() => setIsEditModalOpen(true)}>
                <Settings size={16} />
                <span>Edit Profile</span>
              </button>
              <button 
                className="profile-btn icon-only-btn"
                title="Share Profile"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profil bağlantısı kopyalandı!');
                }}
              >
                <span> <Share2 size={16} /></span>
              </button>
            </div>
          </div>

          <div className="profile-info">
           <h1 className="user-name">{currentUser.name}</h1>
            <span className="user-handle">{currentUser.username}</span>
            <p className="user-bio">{currentUser.bio}</p>

            {/* Dinamik İstatistikler */}
            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-val">{userReviews.length}</span>
                <span className="stat-lbl">Reviews</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{watchlist.length}</span>
                <span className="stat-lbl">Watchlist</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{likedMovies.length}</span>
                <span className="stat-lbl">Likes</span>
              </div>
             <div 
          className="stat-box clickable-stat" 
          onClick={() => openFollowModal('followers')}
          title="Takipçileri Görüntüle"
        >
          <span className="stat-val">{currentUser.followers || 328}</span>
          <span className="stat-lbl">Followers</span>
        </div>

        {/* Tıklanabilir Takip Edilen Kutusu */}
        <div 
          className="stat-box clickable-stat" 
          onClick={() => openFollowModal('following')}
          title="Takip Edilenleri Görüntüle"
        >
          <span className="stat-val">{followingList ? followingList.length : 2}</span>
          <span className="stat-lbl">Following</span>
        </div>
            </div>
          </div>
           {/* 5. TOPLULUK KEŞFİ: KULLANICI ARAMA & TAKİP ÖNERİLERİ */}
        <section className="community-discovery-section glass-panel">
          <div className="discovery-header">
            <div className="disc-title">
              <Sparkles size={20} color="#f5c518" />
              <h3>Sinemasever Topluluğu Keşfet</h3>
            </div>

            {/* Arama Çubuğu */}
            <div className="user-search-bar">
              <Search size={16} color="#888" />
              <input 
                type="text" 
                placeholder="Kullanıcı veya eleştirmen ara..." 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
              {userSearchQuery && (
                <button className="clear-search" onClick={() => setUserSearchQuery('')}>×</button>
              )}
            </div>
          </div>

          {/* Eğer arama yapılıyorsa sonuçları, yapılmıyorsa takip önerilerini göster */}
          <div className="discovery-users-grid">
            {(userSearchQuery ? filteredUsers : suggestedUsers).map((u) => {
              const isFollowed = followingList.includes(u.username);
              return (
                <div key={u.id} className="suggested-user-card glass-panel">
                  <img src={u.avatar} alt={u.name} className="sugg-avatar" />
                  <div className="sugg-info">
                    <strong className="sugg-name">{u.name}</strong>
                    <span className="sugg-handle">{u.username}</span>
                    <p className="sugg-bio">{u.bio}</p>
                  </div>
                  <button 
                    type="button" 
                    className={`sugg-follow-btn ${isFollowed ? 'following' : ''}`}
                    onClick={() => toggleFollow(u.username)}
                  >
                    {isFollowed ? <UserCheck size={14} /> : <UserPlus size={14} />}
                    <span>{isFollowed ? 'Takiptesin' : 'Takip Et'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        </div>

        {/* 3. PINNED FAVORITES */}
        <div className="pinned-section">
          <div className="section-title-row">
            <h3>📌 Favorite Masterpieces</h3>
            <span className="sub-hint">Pinned to Profile</span>
          </div>

        <div className="pinned-grid">
            {pinnedList.map(film => (
              <Link to={`/movie/${film.slug}`} key={film.slug} className="pinned-card">
                <img src={film.poster} alt={film.title} />
                <div className="pinned-overlay">
                  <h4>{film.title}</h4>
                  <span>{film.year || 2024}</span>
                </div>
              </Link>
            ))}
          </div>
        
        </div>
 <section className="profile-section-custom-lists">
        <div className="section-title-row">
          <div className="title-with-icon">
            <FolderHeart size={22} color="#f5c518" />
            <h2>Özel Sinema Koleksiyonları ({customLists.length})</h2>
          </div>
          <button 
            className="create-new-list-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <ListPlus size={16} />
            <span>Yeni Liste Oluştur</span>
          </button>
        </div>

        {/* LİSTELER GRİDİ */}
        <div className="custom-lists-grid">
          {customLists.length > 0 ? (
            customLists.map((list) => {
              // Listedeki filmlerin afişlerini bul
              const listMovies = (allMoviesData || []).filter((m) =>
                list.movieSlugs.includes(m.slug)
              );

              return (
                <div key={list.id} className="custom-list-card glass-panel">
                  <div className="list-card-header">
                    <h3>{list.title}</h3>
                    <button
                      className="delete-list-btn"
                      title="Listeyi Sil"
                      onClick={() => handleDeleteList(list.id, list.title)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {list.description && (
                    <p className="list-card-desc">{list.description}</p>
                  )}

                  {/* Film Afişleri Önizleme Bandı (Letterboxd stack tarzı) */}
                  <div className="list-posters-preview">
                    {listMovies.length > 0 ? (
                      listMovies.slice(0, 4).map((movie, idx) => (
                        <Link 
                          to={`/movie/${movie.slug}`} 
                          key={movie.slug} 
                          className="poster-preview-item"
                          style={{ zIndex: 4 - idx }}
                        >
                          <img src={movie.poster} alt={movie.title} />
                        </Link>
                      ))
                    ) : (
                      <div className="empty-list-indicator">
                        <Film size={20} color="#555" />
                        <span>Henüz film eklenmedi</span>
                      </div>
                    )}
                  </div>

                  <div className="list-card-footer">
                    <span className="count-tag">{list.movieSlugs.length} Film</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-custom-lists glass-panel">
              <p>Henüz özel bir film koleksiyonu oluşturmadınız.</p>
            </div>
          )}
        </div>
      </section>{isModalOpen && (
              <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Yeni Sinema Koleksiyonu</h3>
                    <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
      
                  <form onSubmit={handleCreateList} className="modal-form">
                    <div className="form-group">
                      <label>Koleksiyon Başlığı *</label>
                      <input
                        type="text"
                        placeholder="Örn: 90'lar Atmosferik Gerilimler"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
      
                    <div className="form-group">
                      <label>Açıklama (Opsiyonel)</label>
                      <textarea
                        rows="3"
                        placeholder="Bu liste hakkında kısa bir açıklama..."
                        value={newListDesc}
                        onChange={(e) => setNewListDesc(e.target.value)}
                      ></textarea>
                    </div>
      
                    <div className="modal-actions">
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Vazgeç
                      </button>
                      <button type="submit" className="confirm-btn">
                        Listeyi Oluştur
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        {/* 4. SEKMELER (TABS) */}
        <div className="profile-tabs-bar">
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={17} />
            My Reviews ({userReviews.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <Bookmark size={17} />
            Watchlist ({watchlistMovies.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <Heart size={17} />
            Likes ({likedMoviesList.length})
          </button>
        </div>

        {/* TAB İÇERİKLERİ */}
        <div className="tab-body">
          {/* A. REVIEWS (Context'teki userReviews listelenir) */}
          {activeTab === 'reviews' && (
            <div className="reviews-list">
              {userReviews.length > 0 ? (
                userReviews.map(item => (
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
                ))
              ) : (
                <div className="empty-tab-state glass-panel">
                  <Star size={40} color="#777" />
                  <p>Henüz bir inceleme yazmadın. + Log butonuna tıklayarak ilk incelemeni paylaş!</p>
                </div>
              )}
            </div>
          )}

          {/* B. WATCHLIST (Context'teki watchlist listelenir) */}
          {activeTab === 'watchlist' && (
            <div className="watchlist-grid">
              {watchlistMovies.length > 0 ? (
                watchlistMovies.map(film => (
                  <div key={film.slug} className="watchlist-card glass-panel">
                    <img src={film.poster} alt={film.title} />
                    <div className="watchlist-info">
                      <div className="card-title">{film.title}</div>
                      <Link to={`/movie/${film.slug}`}>
                        <button className="watch-now-btn">Go to Movie</button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-tab-state glass-panel">
                  <Bookmark size={40} color="#777" />
                  <p>İzleme listenizde henüz film yok.</p>
                </div>
              )}
            </div>
          )}

          {/* C. LIKES (Context'teki likedMovies listelenir) */}
          {activeTab === 'likes' && (
            <div className="watchlist-grid">
              {likedMoviesList.length > 0 ? (
                likedMoviesList.map(film => (
                  <div key={film.slug} className="watchlist-card glass-panel">
                    <img src={film.poster} alt={film.title} />
                    <div className="watchlist-info">
                      <div className="card-title">{film.title}</div>
                      <Link to={`/movie/${film.slug}`}>
                        <button className="watch-now-btn" style={{ background: '#ff4757', color: '#fff' }}>
                          Go to Movie
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-tab-state glass-panel">
                  <Heart size={40} color="#777" />
                  <p>Henüz beğendiğin bir film yok.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

     

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
      <FollowModal 
        isOpen={isFollowModalOpen} 
        onClose={() => setIsFollowModalOpen(false)} 
        initialTab={followModalTab}
      />

      {/* QUICK LOG MODAL */}
      <QuickReviewModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        lang="TR"
      />
    </div>
  );
}