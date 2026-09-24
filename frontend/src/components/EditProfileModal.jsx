import React, { useState, useEffect } from 'react';
import { X, Save, Image, Film, User, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 👈 Gerçek Auth Context
import { useMovies } from '../context/MovieContext'; // 👈 Sadece filmler için
import { useToast } from '../context/ToastContext';
import '../styles/editProfile.css';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, login } = useAuth(); // 👈 Gerçek aktif kullanıcı ve oturum güncelleme fonksiyonu
  const { movies } = useMovies(); 
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const [pinned, setPinned] = useState(['', '', '', '']);

  useEffect(() => {
    if (user) {
      setName(user.fullName || user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatar(user.avatarUrl || user.avatar || '');
      setBanner(user.bannerUrl || user.banner || '');
      
      const currentPinned = user.pinnedFavorites && user.pinnedFavorites.length === 4
        ? user.pinnedFavorites.map(String)
        : (movies.slice(0, 4).map(m => m.id.toString()));

      setPinned(currentPinned.length === 4 ? currentPinned : ['', '', '', '']);
    }
  }, [user, isOpen, movies]);

  if (!isOpen || !user) return null;

  // Dosya seçildiğinde resmi Base64 formatına çeviren fonksiyon
  const handleImageUpload = (e, setImageState) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Görsel boyutu 2MB\'dan küçük olmalıdır.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageState(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePinnedChange = (index, value) => {
    const newPinned = [...pinned];
    newPinned[index] = value;
    setPinned(newPinned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Güncellenmiş kullanıcı objesini oluşturuyoruz
    const updatedUser = {
      ...user,
      fullName: name.trim(),
      name: name.trim(),
      username: username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`,
      bio: bio.trim(),
      avatarUrl: avatar.trim(),
      avatar: avatar.trim(),
      bannerUrl: banner.trim(),
      banner: banner.trim(),
      pinnedFavorites: pinned
    };

    // AuthContext ve localStorage'ı güncelliyoruz
    login(updatedUser);
    
    showToast('Profilin başarıyla güncellendi! ✨', 'success');
    onClose();
  };

  return (
    <div className="edit-backdrop" onClick={onClose}>
      <div className="edit-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <div className="edit-title-group">
            <User size={22} color="#f5c518" />
            <h3>Profili Düzenle</h3>
          </div>
          <button className="edit-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Canlı Önizleme */}
          <div className="edit-preview-row">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt="Avatar Önizleme"
              className="avatar-preview-img"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="preview-meta">
              <strong>{name || 'Kullanıcı Adı'}</strong>
              <span>{username || '@kullanici'}</span>
            </div>
          </div>

          <div className="edit-grid-2">
            <div className="edit-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="edit-group">
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="edit-group">
            <label>Biyografi</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Sinema zevkini, favori yönetmenlerini anlat..."
            ></textarea>
          </div>

          {/* Profil Resmi (URL veya Bilgisayardan Dosya Seç) */}
          <div className="edit-group">
            <label><Image size={14} /> Profil Resmi (Avatar)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="URL yapıştır veya dosya seç..."
                style={{ flex: 1 }}
              />
              <label style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', 
                padding: '0 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap', color: '#fff'
              }}>
                <Upload size={14} /> Seç
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImageUpload(e, setAvatar)} 
                />
              </label>
            </div>
          </div>

          {/* Banner Görseli (URL veya Bilgisayardan Dosya Seç) */}
          <div className="edit-group">
            <label><Image size={14} /> Kapak Görseli (Banner)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="URL yapıştır veya dosya seç..."
                style={{ flex: 1 }}
              />
              <label style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', 
                padding: '0 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap', color: '#fff'
              }}>
                <Upload size={14} /> Seç
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImageUpload(e, setBanner)} 
                />
              </label>
            </div>
          </div>

          {/* Sabitlenen 4 Favori Film */}
          <div className="pinned-selection-section">
            <label className="section-label">
              <Film size={16} color="#f5c518" />
              <span>Sabitlenen 4 Başyapıt (Pinned Favorites)</span>
            </label>
            <div className="pinned-selects-grid">
              {[0, 1, 2, 3].map((slot) => (
                <div key={slot} className="pinned-slot-box">
                  <span className="slot-badge">#{slot + 1}</span>
                  <select
                    value={pinned[slot]}
                    onChange={(e) => handlePinnedChange(slot, e.target.value)}
                    className="pinned-dropdown"
                    required
                  >
                    <option value="">Film Seç...</option>
                    {movies && movies.map((m) => (
                      <option key={m.id} value={m.id.toString()}>
                        {m.title} ({m.releaseYear || '2024'})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="edit-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="save-btn">
              <Save size={16} />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}