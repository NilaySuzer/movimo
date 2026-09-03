import React, { useState } from 'react';
import { X, Star, Film } from 'lucide-react';
import { movies } from '../data/moviesData';
import { useMovies } from '../context/MovieContext';
import '../styles/modal.css';

export default function QuickReviewModal({ isOpen, onClose, lang }) {
  const [selectedMovie, setSelectedMovie] = useState('');
  const { addReview } = useMovies();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovie || !comment.trim()) return;
    const targetMovie = movies.find(m => m.title === selectedMovie);

    // user alanını ekleyerek Context ile tam uyumlu hale getiriyoruz
    addReview({
      slug: targetMovie ? targetMovie.slug : 'custom',
      movieTitle: selectedMovie,
      poster: targetMovie ? targetMovie.poster : '/imgs/dk.png',
      rating,
      comment: comment.trim(),
      user: 'Nilay Süzer' // Profil sahibi adı
    });

    alert(lang === 'TR' ? 'İncelemeniz başarıyla paylaşıldı! 🎬' : 'Review posted successfully! 🎬');
    setSelectedMovie('');
    setComment('');
    setRating(5);
    onClose();
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
            value={selectedMovie} 
            onChange={(e) => setSelectedMovie(e.target.value)} 
            required
            className="modal-select"
          >
            <option value="">{lang === 'TR' ? '-- Film Seçiniz --' : '-- Choose a Movie --'}</option>
            {movies.map((m) => (
              <option key={m.slug} value={m.title}>{m.title}</option>
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

          <button type="submit" className="modal-submit-btn">
            {lang === 'TR' ? 'İncelemeyi Kaydet' : 'Save & Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}