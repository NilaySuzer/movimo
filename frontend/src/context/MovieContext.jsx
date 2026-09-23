import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // 1. API'den Gelen Filmler (Merkezi State)
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const fetchMovies = () => {
    fetch('http://localhost:5080/api/movies')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setMovies(data);
        setLoadingMovies(false);
      })
      .catch((err) => {
        console.error('Filmler API hatası:', err);
        setLoadingMovies(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // 2. Kullanıcı State'i
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
      isLoggedIn: true,
      pinnedFavorites: ['1', '2', '3', '4']
    };
  });

  // 3. Özel Kullanıcı Listeleri State'i (Filmler ID ile tutulur)
  const [customLists, setCustomLists] = useState(() => {
    const saved = localStorage.getItem('cinenest_custom_lists');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'list-1', 
        title: 'Gece Kuşağı & Zihin Bükücüler', 
        description: 'Gece yarısı izlenmesi gereken atmosferik yapımlar.',
        movieSlugs: ['1', '2'] 
      }
    ];
  });

  // 4. MSSQL Backend Senkronizasyonlu Etkileşimler
  const [interactions, setInteractions] = useState([]);
  const activeUserId = 'default_user';

  useEffect(() => {
    fetch(`http://localhost:5080/api/interactions/user/${activeUserId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInteractions(data))
      .catch((err) => console.error('Etkileşimler API hatası:', err));
  }, []);

  const isInWatchlist = (slugOrId) => {
    const movieId = parseInt(slugOrId, 10);
    const item = interactions.find((i) => i.movieId === movieId);
    return item ? item.isInWatchlist : false;
  };

  const isMovieLiked = (slugOrId) => {
    const movieId = parseInt(slugOrId, 10);
    const item = interactions.find((i) => i.movieId === movieId);
    return item ? item.isLiked : false;
  };

  const toggleWatchlist = async (slugOrId) => {
    const movieId = parseInt(slugOrId, 10);
    try {
      const res = await fetch('http://localhost:5080/api/interactions/toggle-watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId: activeUserId })
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) => {
          const exists = prev.some((i) => i.movieId === movieId);
          if (exists) {
            return prev.map((i) => (i.movieId === movieId ? { ...i, isInWatchlist: data.isInWatchlist } : i));
          }
          return [...prev, { movieId, isLiked: false, isInWatchlist: data.isInWatchlist }];
        });
      }
    } catch (err) {
      console.error('Watchlist güncellenemedi:', err);
    }
  };

  const toggleLike = async (slugOrId) => {
    const movieId = parseInt(slugOrId, 10);
    try {
      const res = await fetch('http://localhost:5080/api/interactions/toggle-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId: activeUserId })
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) => {
          const exists = prev.some((i) => i.movieId === movieId);
          if (exists) {
            return prev.map((i) => (i.movieId === movieId ? { ...i, isLiked: data.isLiked } : i));
          }
          return [...prev, { movieId, isLiked: data.isLiked, isInWatchlist: false }];
        });
      }
    } catch (err) {
      console.error('Like güncellenemedi:', err);
    }
  };

  // Özel liste metodları (Seçilen film ID'lerini de alabilir)
  const createCustomList = (title, description = '', selectedIds = []) => {
    if (!title.trim()) return;
    const newList = {
      id: `list-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      movieSlugs: selectedIds.map(String) // ID'leri dizi olarak sakla
    };
    const updated = [newList, ...customLists];
    setCustomLists(updated);
    localStorage.setItem('cinenest_custom_lists', JSON.stringify(updated));
  };

  const deleteCustomList = (listId) => {
    const updated = customLists.filter((l) => l.id !== listId);
    setCustomLists(updated);
    localStorage.setItem('cinenest_custom_lists', JSON.stringify(updated));
  };

  const toggleMovieInList = (listId, movieSlugOrId) => {
    const idStr = movieSlugOrId.toString();
    const updated = customLists.map((list) => {
      if (list.id === listId) {
        const exists = list.movieSlugs.includes(idStr);
        const newSlugs = exists
          ? list.movieSlugs.filter((s) => s !== idStr)
          : [...list.movieSlugs, idStr];
        return { ...list, movieSlugs: newSlugs };
      }
      return list;
    });
    setCustomLists(updated);
    localStorage.setItem('cinenest_custom_lists', JSON.stringify(updated));
  };

  // Kullanıcı İncelemeleri State'i
  const [userReviews, setUserReviews] = useState(() => {
    const saved = localStorage.getItem('movie_user_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [lang, setLang] = useState(() => localStorage.getItem('movie_lang') || 'TR');
  const [cinemaMode, setCinemaMode] = useState(() => localStorage.getItem('movie_cinema_mode') === 'true');
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

  // Auth Metodları
  const login = (email, password) => {
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

  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      ...reviewData,
      isSpoiler: Boolean(reviewData.isSpoiler),
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
      setCurrentUser(u => u ? { ...u, following: updated.length } : u);
      return updated;
    });
  };

  return (
    <MovieContext.Provider
      value={{
        movies,              // 👈 TÜM UYGULAMA İÇİN API FİLMLERİ
        loadingMovies,
        fetchMovies,
        currentUser,
        updateProfile,
        followingList,
        customLists,
        createCustomList,
        deleteCustomList,
        toggleMovieInList,
        toggleFollow,
        login,
        register,
        logout,
        watchlist: interactions.filter((i) => i.isInWatchlist).map((i) => i.movieId.toString()),
        likedMovies: interactions.filter((i) => i.isLiked).map((i) => i.movieId.toString()),
        userReviews,
        toggleWatchlist,
        toggleLike,
        addReview,
        deleteReview,
        isInWatchlist,
        isMovieLiked,
        lang,
        setLang,
        cinemaMode,
        setCinemaMode
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export const useMovies = () => useContext(MovieContext);