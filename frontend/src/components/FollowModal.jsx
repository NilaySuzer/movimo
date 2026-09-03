import React, { useState } from 'react';
import { X, Users, UserCheck, UserPlus } from 'lucide-react';
import { communityUsers } from '../data/usersData';
import { useMovies } from '../context/MovieContext';
import '../styles/followModal.css';

export default function FollowModal({ isOpen, onClose, initialTab = 'followers' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { followingList, toggleFollow } = useMovies();

  if (!isOpen) return null;

  // Takipçiler listesi (Örnek topluluk kullanıcıları)
  const followersList = communityUsers;

  // Takip edilenler listesi (Context'teki followingList'e göre filtrelenir)
  const followingUsers = communityUsers.filter(u => followingList.includes(u.username));

  const currentList = activeTab === 'followers' ? followersList : followingUsers;

  return (
    <div className="follow-backdrop" onClick={onClose}>
      <div className="follow-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Başlık ve Kapat Butonu */}
        <div className="follow-modal-header">
          <div className="follow-title-group">
            <Users size={22} color="#f5c518" />
            <h3>Topluluk Bağlantıları</h3>
          </div>
          <button className="follow-close-btn" onClick={onClose} aria-label="Kapat">
            <X size={20} />
          </button>
        </div>

        {/* Sekmeler: Followers vs Following */}
        <div className="follow-tabs">
          <button
            type="button"
            className={`follow-tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Takipçiler ({followersList.length})
          </button>
          <button
            type="button"
            className={`follow-tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Takip Edilenler ({followingList.length})
          </button>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="follow-user-list">
          {currentList.length > 0 ? (
            currentList.map((user) => {
              const isUserFollowed = followingList.includes(user.username);

              return (
                <div key={user.id} className="follow-user-row">
                  <img src={user.avatar} alt={user.name} className="follow-avatar" />
                  
                  <div className="follow-user-info">
                    <strong className="follow-name">{user.name}</strong>
                    <span className="follow-handle">{user.username}</span>
                    <p className="follow-bio">{user.bio}</p>
                  </div>

                  <button
                    type="button"
                    className={`follow-action-btn ${isUserFollowed ? 'following' : 'not-following'}`}
                    onClick={() => toggleFollow(user.username)}
                  >
                    {isUserFollowed ? (
                      <>
                        <UserCheck size={15} />
                        <span>Takiptesin</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>Takip Et</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="follow-empty-state">
              <Users size={36} color="#666" />
              <p>Henüz kimseyi takip etmiyorsun.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}