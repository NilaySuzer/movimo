import React, { useState, useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';
import { 
  User, 
  Settings, 
  PlusCircle, 
  Star, 
  Bookmark, 
  Heart, 
  Trash2, 
  Calendar,
  Share2,
  Search,     
  UserPlus,    
  UserCheck, 
  Sparkles, 
  ListPlus, 
  Film, 
  FolderHeart, 
  X 
} from 'lucide-react';
import QuickReviewModal from '../components/QuickReviewModal';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { communityUsers } from '../data/usersData'; 
import EditProfileModal from '../components/EditProfileModal';
import FollowModal from '../components/FollowModal';
import '../styles/profile.css';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: authUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'watchlist' | 'likes'
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState('followers');
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  
  const [dbMovies, setDbMovies] = useState([]);
  const [dbUserReviews, setDbUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

 const profileUser = userId 
    ? (communityUsers.find(u => u.id.toString() === userId.toString()) || authUser) 
    : authUser;

  const user = profileUser;
  const { 
    customLists = [], 
    createCustomList, 
    deleteCustomList,
    watchlist = [], 
    followingList = [], 
    likedMovies = [], 
    toggleFollow
  } = useMovies();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // 1. Verileri Çekme
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const authorName = user.fullName || user.name || user.username || '';

    Promise.all([
      fetch('http://localhost:5080/api/movies').then((res) => (res.ok ? res.json() : [])),
      authorName ? fetch(`http://localhost:5080/api/reviews/user/${authorName}`).then((res) => (res.ok ? res.json() : [])) : Promise.resolve([])
    ])
      .then(([moviesData, reviewsData]) => {
        setDbMovies(moviesData);
        setDbUserReviews(reviewsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profil verisi çekilemedi:', err);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container" style={{ padding: '100px 20px', textAlign: 'center', color: '#fff' }}>
        <h2>Giriş Yapılmadı</h2>
        <p style={{ color: '#aaa', marginTop: '10px' }}>Profilinizi görüntülemek için lütfen giriş yapın.</p>
      </div>
    );
  }

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    createCustomList(newListTitle, newListDesc, selectedMovieIds);
    setNewListTitle('');
    setNewListDesc('');
    setSelectedMovieIds([]);
    setIsModalOpen(false);
    showToast('Yeni sinema listeniz oluşturuldu! 🎬', 'success');
  };

  const handleDeleteList = (listId, listTitle) => {
    if (window.confirm(`"${listTitle}" listesini silmek istediğinize emin misiniz?`)) {
      deleteCustomList(listId);
      showToast('Liste silindi.', 'info');
    }
  };

  const openFollowModal = (tabName) => {
    setFollowModalTab(tabName);
    setIsFollowModalOpen(true);
  };

  // Watchlist, Likes ve Pinned filmleri veritabanındaki filmlerle güvenli eşleştirme
  const watchlistMovies = dbMovies.filter((m) => watchlist.map(String).includes(m.id.toString()));
  const likedMoviesList = dbMovies.filter((m) => likedMovies.map(String).includes(m.id.toString()));

 // 1. Veritabanından gelen string ("1,3,5") veya dizi halindeki veriyi güvenle array'e çeviriyoruz:
  const pinnedFavoritesArray = typeof user?.pinnedFavorites === 'string'
    ? user.pinnedFavorites.split(',').filter(Boolean)
    : (Array.isArray(user?.pinnedFavorites) ? user.pinnedFavorites : []);

  // 2. Artık .map() yerine güvenli dizimizi String'e çevirip kullanabiliriz:
  const pinnedMovieIds = pinnedFavoritesArray.map(String);
  const pinnedList = dbMovies.filter((m) => pinnedMovieIds.includes(m.id.toString()));

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Bu incelemeyi silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`http://localhost:5080/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDbUserReviews((prev) => prev.filter((r) => r.id !== id));
        showToast('İnceleme başarıyla silindi.', 'info');
      } else {
        showToast('İnceleme silinirken hata oluştu.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Sunucuya ulaşılamadı.', 'error');
    }
  };

  const filteredUsers = communityUsers.filter((u) => {
    return u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase());
  });

  const suggestedUsers = communityUsers.filter((u) => !followingList.map(String).includes(u.id.toString())).slice(0, 3);

  return (
    <div className="profile-container">
      {/* 1. BANNER */}
      <div className="profile-banner-wrapper">
        <div 
          className="profile-banner-img" 
          style={{ 
            background: (user.bannerUrl || user.banner) ? `url(${user.bannerUrl || user.banner}) center/cover no-repeat` : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            height: '240px',
            width: '100%'
          }}
        />
        <div className="banner-overlay"></div>
      </div>

      <div className="profile-content-wrap">
        {/* 2. PROFİL ÜST KART */}
        <div className="profile-header-card glass-panel">
          <div className="profile-avatar-row">
            <div className="avatar-wrapper">
              <img 
                src={user.avatarUrl || user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                alt={user.fullName || user.name} 
                className="profile-avatar" 
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
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
                  showToast('Profil bağlantısı panoya kopyalandı! 🔗', 'success');
                }}
              >
                <span><Share2 size={16} /></span>
              </button>
            </div>
          </div>

          <div className="profile-info">
            <h1 className="user-name">{user.fullName || user.name || user.username}</h1>
            <span className="user-handle">{user.username}</span>
            <p className="user-bio">{user.bio || "Henüz bir biyografi eklenmemiş."}</p>

            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-val">{dbUserReviews.length}</span>
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
              <div className="stat-box clickable-stat" onClick={() => openFollowModal('followers')}>
                <span className="stat-val">{followingList ? followingList.length : 0}</span>
                <span className="stat-lbl">Followers</span>
              </div>
              <div className="stat-box clickable-stat" onClick={() => openFollowModal('following')}>
                <span className="stat-val">{followingList ? followingList.length : 0}</span>
                <span className="stat-lbl">Following</span>
              </div>
            </div>
          </div>

          {/* TOPLULUK KEŞFİ */}
          <section className="community-discovery-section glass-panel">
            <div className="discovery-header">
              <div className="disc-title">
                <Sparkles size={20} color="#f5c518" />
                <h3>Sinemasever Topluluğu Keşfet</h3>
              </div>
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

            <div className="discovery-users-grid">
              {(userSearchQuery ? filteredUsers : suggestedUsers).map((u) => {
                const isFollowed = followingList.map(String).includes(u.id.toString());
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
                      onClick={() => toggleFollow(u.id)}
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

        {/* 3. PINNED FAVORITES (Sabitlenen 4 Başyapıt) */}
        <div className="pinned-section">
          <div className="section-title-row">
            <h3>📌 Favorite Masterpieces</h3>
            <span className="sub-hint">Pinned to Profile</span>
          </div>

          <div className="pinned-grid">
            {pinnedList.length > 0 ? (
              pinnedList.map((film) => (
                <Link to={`/movie/${film.id}`} key={film.id} className="pinned-card">
                  <img src={film.posterUrl || '/imgs/default.png'} alt={film.title} />
                  <div className="pinned-overlay">
                    <h4>{film.title}</h4>
                    <span>{film.releaseYear || 2024}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-tab-state glass-panel" style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center' }}>
                <Film size={32} color="#555" />
                <p style={{ color: '#888', marginTop: '10px' }}>Henüz profilinize film pinlemediniz. "Edit Profile" butonuna tıklayarak başyapıtlarınızı seçebilirsiniz!</p>
              </div>
            )}
          </div>
        </div>

        {/* ÖZEL LİSTELER */}
        <section className="profile-section-custom-lists">
          <div className="section-title-row">
            <div className="title-with-icon">
              <FolderHeart size={22} color="#f5c518" />
              <h2>Özel Sinema Koleksiyonları ({customLists.length})</h2>
            </div>
            <button className="create-new-list-btn" onClick={() => setIsModalOpen(true)}>
              <ListPlus size={16} />
              <span>Yeni Liste Oluştur</span>
            </button>
          </div>

          <div className="custom-lists-grid">
            {customLists.length > 0 ? (
              customLists.map((list) => {
                const listMovies = dbMovies.filter((m) => list.movieSlugs.includes(m.id.toString()));
                return (
                  <div key={list.id} className="custom-list-card glass-panel">
                    <div className="list-card-header">
                      <h3>{list.title}</h3>
                      <button className="delete-list-btn" onClick={() => handleDeleteList(list.id, list.title)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {list.description && <p className="list-card-desc">{list.description}</p>}
                    <div className="list-posters-preview">
                      {listMovies.length > 0 ? (
                        listMovies.slice(0, 4).map((movie, idx) => (
                          <Link to={`/movie/${movie.id}`} key={movie.id} className="poster-preview-item" style={{ zIndex: 4 - idx }}>
                            <img src={movie.posterUrl || '/imgs/default.png'} alt={movie.title} />
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
        </section>

        {/* YENİ LİSTE MODAL */}
        {isModalOpen && (
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

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: '#f5c518', fontSize: '0.9rem' }}>
                    Listeye Film Ekle ({selectedMovieIds.length} seçildi):
                  </label>
                  <div style={{
                    maxHeight: '160px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {dbMovies.map((film) => {
                      const isChecked = selectedMovieIds.includes(film.id.toString());
                      return (
                        <label 
                          key={film.id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: isChecked ? '#fff' : '#aaa'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const idStr = film.id.toString();
                              if (e.target.checked) {
                                setSelectedMovieIds(prev => [...prev, idStr]);
                              } else {
                                setSelectedMovieIds(prev => prev.filter(id => id !== idStr));
                              }
                            }}
                            style={{ accentColor: '#f5c518' }}
                          />
                          <span>{film.title} ({film.releaseYear || '2024'})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
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

        {/* SEKMELER */}
        <div className="profile-tabs-bar">
          <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            <Star size={17} /> My Reviews ({dbUserReviews.length})
          </button>
          <button className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>
            <Bookmark size={17} /> Watchlist ({watchlistMovies.length})
          </button>
          <button className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => setActiveTab('likes')}>
            <Heart size={17} /> Likes ({likedMoviesList.length})
          </button>
        </div>

        {/* TAB İÇERİKLERİ */}
        <div className="tab-body">
          {activeTab === 'reviews' && (
            <div className="reviews-list">
              {dbUserReviews.length > 0 ? (
                dbUserReviews.map((item) => (
                  <div key={item.id} className="user-review-card glass-panel">
                    <Link to={`/movie/${item.movieId}`} className="review-film-poster">
                      <img src={item.poster} alt={item.movieTitle} />
                    </Link>
                    <div className="review-film-details">
                      <div className="review-top-line">
                        <Link to={`/movie/${item.movieId}`} className="review-film-name">{item.movieTitle}</Link>
                        <div className="review-date">
                          <Calendar size={13} />
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="review-rating-row">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} color="#f5c518" fill={i < Math.floor(item.rating) ? "#f5c518" : "none"} />
                        ))}
                        <span className="rating-num">{item.rating}/5</span>
                      </div>
                      <p className="review-text">{item.comment}</p>
                      <div className="review-card-footer">
                        <button className="delete-review-btn" onClick={() => handleDeleteReview(item.id)}>
                          <Trash2 size={15} /> Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-tab-state glass-panel">
                  <Star size={40} color="#777" />
                  <p>Henüz bir inceleme yazmadın. Detay sayfasından bir filme yorum yaparak başlayabilirsin!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="watchlist-grid">
              {watchlistMovies.length > 0 ? (
                watchlistMovies.map((film) => (
                  <div key={film.id} className="watchlist-card glass-panel">
                    <img src={film.posterUrl || '/imgs/default.png'} alt={film.title} />
                    <div className="watchlist-info">
                      <div className="card-title">{film.title}</div>
                      <Link to={`/movie/${film.id}`}>
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

          {activeTab === 'likes' && (
            <div className="watchlist-grid">
              {likedMoviesList.length > 0 ? (
                likedMoviesList.map((film) => (
                  <div key={film.id} className="watchlist-card glass-panel">
                    <img src={film.posterUrl || '/imgs/default.png'} alt={film.title} />
                    <div className="watchlist-info">
                      <div className="card-title">{film.title}</div>
                      <Link to={`/movie/${film.id}`}>
                        <button className="watch-now-btn" style={{ background: '#ff4757', color: '#fff' }}>Go to Movie</button>
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

      {/* MODALLAR */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <FollowModal isOpen={isFollowModalOpen} onClose={() => setIsFollowModalOpen(false)} initialTab={followModalTab} />
      <QuickReviewModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} lang="TR" />
    </div>
  );
}