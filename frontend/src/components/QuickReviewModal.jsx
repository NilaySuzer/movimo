import React, { useState } from 'react';
import { X, Star, Film } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import '../styles/modal.css';

export default function QuickReviewModal({ isOpen, onClose, lang, onReviewAdded }) {
  const { movies } = useMovies();
  const { user } = useAuth();
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedMovieId || !comment.trim() || isSubmitting) return;

  setIsSubmitting(true);

  // Aktif kullanıcının adını/username'ini güvenli şekilde alıyoruz
  const authorName = user?.fullName || user?.name || user?.username || 'Sinemasever';

  const payload = {
    movieId: parseInt(selectedMovieId, 10),
    author: authorName, 
    user: authorName, 
    comment: comment.trim(),
    rating: Number(rating),
    isSpoiler: Boolean(isSpoiler),
    upvotes: 0
  };

  try {
    const res = await fetch('http://localhost:5080/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Yorum kaydedilemedi');

    alert(lang === 'TR' ? 'İncelemeniz başarıyla paylaşıldı! 🎬' : 'Review posted successfully! 🎬');
    
    if (typeof onReviewAdded === 'function') {
      onReviewAdded();
    }

    setSelectedMovieId('');
    setComment('');
    setRating(5);
    setIsSpoiler(false);
    onClose();
  } catch (err) {
    console.error('İnceleme ekleme hatası:', err);
    alert(lang === 'TR' ? 'İnceleme kaydedilirken sunucu hatası oluştu.' : 'Failed to submit review.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Film size={22} color="#f5c518" />
            <h3>{lang === 'TR' ? 'Hızlı Film İncelemesi' : 'Log / Review a Movie'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>{lang === 'TR' ? 'Film Seç:' : 'Select Movie:'}</label>
          <select 
            value={selectedMovieId} 
            onChange={(e) => setSelectedMovieId(e.target.value)} 
            required
            className="modal-select"
          >
            <option value="">{lang === 'TR' ? '-- Film Seçiniz --' : '-- Choose a Movie --'}</option>
            {movies && movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.releaseYear || '2024'})
              </option>
            ))}
          </select>

          <label>{lang === 'TR' ? 'Puanın:' : 'Your Rating:'}</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className="star-icon"
                color={(hoverRating || rating) >= star ? '#f5c518' : '#555'}
                fill={(hoverRating || rating) >= star ? '#f5c518' : 'none'}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
            <span className="rating-text">{hoverRating || rating} / 5</span>
          </div>

          <label>{lang === 'TR' ? 'Düşüncelerin:' : 'Your Review:'}</label>
          <textarea
            rows="4"
            placeholder={lang === 'TR' ? 'Film nasıldı? spoiler vermeden anlat...' : 'What did you think? Keep it spoiler-free...'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="modal-textarea"
          ></textarea>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0 15px' }}>
            <input
              type="checkbox"
              id="quickSpoilerCheck"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#f5c518' }}
            />
            <label htmlFor="quickSpoilerCheck" style={{ fontSize: '0.85rem', color: '#ccc', cursor: 'pointer' }}>
              {lang === 'TR' ? 'Spoiler içeriyor' : 'Contains spoiler'}
            </label>
          </div>

          <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
            {isSubmitting 
              ? (lang === 'TR' ? 'Kaydediliyor...' : 'Saving...') 
              : (lang === 'TR' ? 'İncelemeyi Kaydet' : 'Save & Publish')}
          </button>
        </form>
      </div>
    </div>
  );
}