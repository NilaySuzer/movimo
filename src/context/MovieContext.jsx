import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // 1. Watchlist State (Slug dizisi olarak tutulur: ['dark-knight', 'interstellar'])
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('movie_watchlist');
    return saved ? JSON.parse(saved) : ['tenet', 'up', 'coco', 'inception'];
  });

  // 2. Liked Movies State (Slug dizisi: ['dark-knight'])
  const [likedMovies, setLikedMovies] = useState(() => {
    const saved = localStorage.getItem('movie_likes');
    return saved ? JSON.parse(saved) : ['dark-knight', 'interstellar'];
  });

  // 3. User Reviews State (Objeler dizisi)
  const [userReviews, setUserReviews] = useState(() => {
    const saved = localStorage.getItem('movie_user_reviews');
    return saved ? JSON.parse(saved) : [
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
    ];
  });

  // LocalStorage Güncellemeleri
  useEffect(() => {
    localStorage.setItem('movie_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('movie_likes', JSON.stringify(likedMovies));
  }, [likedMovies]);

  useEffect(() => {
    localStorage.setItem('movie_user_reviews', JSON.stringify(userReviews));
  }, [userReviews]);

  // Watchlist Ekle / Çıkar Toggle
  const toggleWatchlist = (slug) => {
    setWatchlist((prev) => 
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Beğeni Toggle
  const toggleLike = (slug) => {
    setLikedMovies((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Yeni İnceleme Ekleme
  const addReview = (reviewData) => {
    const newEntry = {
      id: Date.now(),
      date: 'Az önce',
      ...reviewData
    };
    setUserReviews((prev) => [newEntry, ...prev]);
  };

  // İnceleme Silme
  const deleteReview = (id) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        likedMovies,
        userReviews,
        toggleWatchlist,
        toggleLike,
        addReview,
        deleteReview,
        isInWatchlist: (slug) => watchlist.includes(slug),
        isMovieLiked: (slug) => likedMovies.includes(slug)
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

// Kolay erişim için Custom Hook
export const useMovies = () => useContext(MovieContext);