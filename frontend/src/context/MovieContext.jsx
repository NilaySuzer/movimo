import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // 1. Watchlist State (Slug dizisi olarak tutulur: ['dark-knight', 'interstellar'])
  
    const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('movie_current_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'u_1',
      name: "Nilay Süzer",
      username: "@nilaysuzer",
      email: "nilay@example.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
      bio: "Film enthusiast, aspiring cinephile & software developer. Nolan and Tim Burton worshipper 🎬✨",
      followers: 328,
      following: 195,
      isLoggedIn: true,// Varsayılan oturum açık
      pinnedFavorites: ['dark-knight', 'interstellar', 'corpse-bride', 'matrix']
    };
  });
    
   
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
   
    const [lang, setLang] = useState(() => {
    return localStorage.getItem('movie_lang') || 'TR';
  });

  // 6. SİNEMA MODU (cinemaMode) - Yenilenince sıfırlanmasın
  const [cinemaMode, setCinemaMode] = useState(() => {
    return localStorage.getItem('movie_cinema_mode') === 'true';
  });

  // 7. TAKİP EDİLENLER (followingList)
  const [followingList, setFollowingList] = useState(() => {
    const saved = localStorage.getItem('movie_following');
    return saved ? JSON.parse(saved) : ['@christophernolan', '@cinephile_girl'];
  });
    
    
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('movie_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('movie_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('movie_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('movie_likes', JSON.stringify(likedMovies));
  }, [likedMovies]);

  useEffect(() => {
    localStorage.setItem('movie_user_reviews', JSON.stringify(userReviews));
  }, [userReviews]);

  useEffect(() => {
    localStorage.setItem('movie_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('movie_cinema_mode', cinemaMode);
    if (cinemaMode) {
      document.body.classList.add('cinema-mode');
    } else {
      document.body.classList.remove('cinema-mode');
    }
  }, [cinemaMode]);

  useEffect(() => {
    localStorage.setItem('movie_following', JSON.stringify(followingList));
  }, [followingList]);
    
    const login = (email, password) => {
    // Backend gelene kadar mock doğrulama
    const user = {
      id: 'u_1',
      name: "Nilay Süzer",
      username: `@${email.split('@')[0]}`,
      email: email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
      bio: "Film enthusiast, aspiring cinephile & software developer. Nolan and Tim Burton worshipper 🎬✨",
      followers: 328,
      following: 195,
      isLoggedIn: true
    };
    setCurrentUser(user);
    return true;
  };

  const register = (name, email, password) => {
    const newUser = {
      id: 'u_' + Date.now(),
      name: name,
      username: `@${email.split('@')[0]}`,
      email: email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
      bio: "Yeni bir sinemasever aramıza katıldı! 🎬",
      followers: 0,
      following: 0,
      isLoggedIn: true
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('movie_current_user');
  };
    
    const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const toggleWatchlist = (slug) => {
    setWatchlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleLike = (slug) => {
    setLikedMovies((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

 const addReview = (reviewData) => {
  const newReview = {
    id: Date.now(),
    ...reviewData, // 👈 Gönderdiğin her şeyi (isSpoiler dahil) doğrudan alır
    isSpoiler: Boolean(reviewData.isSpoiler), // 👈 Açıkça true/false olarak kilitler
    text: reviewData.comment || reviewData.text,
    upvotes: 0
   };
   
  setUserReviews((prev) => [newReview, ...prev]);
};

  const deleteReview = (id) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleFollow = (username) => {
    setFollowingList((prev) => {
      const isFollowing = prev.includes(username);
      const updated = isFollowing ? prev.filter(u => u !== username) : [...prev, username];
      // Takip edilen sayısını da dinamik güncelle
      setCurrentUser(u => u ? { ...u, following: updated.length } : u);
      return updated;
    });
  };
  
    
  return (
    <MovieContext.Provider
        value={{
              currentUser,
              updateProfile,
            followingList,  
    toggleFollow,
        login,
        register,
        logout,
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