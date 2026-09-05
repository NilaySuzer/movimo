import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Star, Heart, Bookmark, MessageSquare } from 'lucide-react';
import '../styles/activityFeed.css';

// Platform içi canlı topluluk hareketleri (Mock Feed)
const initialFeed = [
  {
    id: 'act-1',
    user: 'Merve D.',
    action: 'inceledi',
    target: 'Interstellar',
    slug: 'interstellar',
    rating: 5,
    type: 'review',
    time: '4 dk önce'
  },
  {
    id: 'act-2',
    user: 'Kaan B.',
    action: 'favorilerine ekledi',
    target: 'Fight Club',
    slug: 'fight-club',
    type: 'like',
    time: '18 dk önce'
  },
  {
    id: 'act-3',
    user: 'Nilay',
    action: 'izleme listesine kaydetti',
    target: 'Inception',
    slug: 'inception',
    type: 'watchlist',
    time: '35 dk önce'
  },
  {
    id: 'act-4',
    user: 'Emre K.',
    action: 'yeni bir liste oluşturdu: "Gece Kuşağı"',
    target: 'Koleksiyon',
    type: 'list',
    time: '1 saat önce'
  }
];

export default function ActivityFeed() {
  const getActionIcon = (type) => {
    switch (type) {
      case 'review':
        return <MessageSquare size={14} color="#f5c518" />;
      case 'like':
        return <Heart size={14} color="#ff4757" fill="#ff4757" />;
      case 'watchlist':
        return <Bookmark size={14} color="#3b82f6" fill="#3b82f6" />;
      default:
        return <Activity size={14} color="#10b981" />;
    }
  };

  return (
    <section className="activity-feed-wrapper">
      <div className="activity-feed-bar glass-panel">
        <div className="feed-title-badge">
          <Activity size={16} className="pulse-icon" />
          <span>Topluluk Nabzı</span>
        </div>

        <div className="feed-ticker-track">
          {initialFeed.map((item) => (
            <div key={item.id} className="feed-chip">
              <span className="feed-chip-icon">{getActionIcon(item.type)}</span>
              <strong className="feed-chip-user">{item.user}</strong>
              <span className="feed-chip-action">{item.action}</span>

              {item.slug ? (
                <Link to={`/movie/${item.slug}`} className="feed-chip-target">
                  {item.target}
                </Link>
              ) : (
                <span className="feed-chip-target">{item.target}</span>
              )}

              {item.rating && (
                <span className="feed-chip-stars">
                  ★ {item.rating}
                </span>
              )}

              <span className="feed-chip-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}