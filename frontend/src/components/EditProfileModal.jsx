import React, { useState, useEffect } from 'react';
import { X, Save, Image, Film, User } from 'lucide-react';
import { movies } from '../data/moviesData';
import { useMovies } from '../context/MovieContext';
import '../styles/editProfile.css';

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useMovies();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const [pinned, setPinned] = useState(['', '', '', '']);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
      setBanner(currentUser.banner || '');
      setPinned(
        currentUser.pinnedFavorites && currentUser.pinnedFavorites.length === 4
          ? currentUser.pinnedFavorites
          : ['dark-knight', 'interstellar', 'corpse-bride', 'matrix']
      );
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handlePinnedChange = (index, value) => {
    const newPinned = [...pinned];
    newPinned[index] = value;
    setPinned(newPinned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      username: username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`,
      bio: bio.trim(),
      avatar: avatar.trim(),
      banner: banner.trim(),
      pinnedFavorites: pinned
    });
    alert('Profilin başarıyla güncellendi! ✨');
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
            <img src={avatar} alt="Avatar Önizleme" className="avatar-preview-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'; }} />
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

          <div className="edit-grid-2">
            <div className="edit-group">
              <label><Image size={14} /> Profil Resmi URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div className="edit-group">
              <label><Image size={14} /> Banner Görseli URL</label>
              <input
                type="url"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://..."
                required
              />
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
                    {movies.map((m) => (
                      <option key={m.slug} value={m.slug}>
                        {m.title}
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