import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export function MovieProvider({ children }) {
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

  // 1. Gerçek Kullanıcı State'i (AuthContext / localStorage 'user' anahtarından beslenir)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Periyodik kontrol ile Auth güncellemelerini anında yakala
    const interval = setInterval(() => {
      const savedUser = localStorage.getItem('user');
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      if (JSON.stringify(parsed) !== JSON.stringify(user)) {
        setUser(parsed);
      }
    }, 400);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  // 2. Özel Kullanıcı Listeleri
  const [customLists, setCustomLists] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return [];
    try {
      const uId = JSON.parse(savedUser).id;
      const saved = localStorage.getItem(`cinenest_custom_lists_${uId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`cinenest_custom_lists_${user.id}`);
      setCustomLists(saved ? JSON.parse(saved) : []);
    } else {
      setCustomLists([]);
    }
  }, [user]);
 const currentUserId = user?.username ? user.username.replace('@', '') : 'default_user';

  useEffect(() => {
    if (!user) {
      setInteractions([]);
      return;
    }
    fetch(`http://localhost:5080/api/interactions/user/${currentUserId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInteractions(data))
      .catch((err) => console.error('Etkileşimler API hatası:', err));
  }, [user]);

  // MSSQL Backend Etkileşimleri (Watchlist & Likes) - LocalStorage Kalıcılık Garantili
  const [interactions, setInteractions] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return [];
    try {
      const uId = JSON.parse(savedUser).id || JSON.parse(savedUser).username;
      const saved = localStorage.getItem(`cinenest_interactions_${uId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user) {
      setInteractions([]);
      return;
    }
    const uId = user.id || user.username;
    
    // Önce varsa yerel depolamadan hızlıca yükle ki boş görünmesin
    const localSaved = localStorage.getItem(`cinenest_interactions_${uId}`);
    if (localSaved) {
      try { setInteractions(JSON.parse(localSaved)); } catch {}
    }

    // Sonra backend'den güncel veriyi çek ve eşitle
    fetch(`http://localhost:5080/api/interactions/user/${uId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setInteractions(data);
          localStorage.setItem(`cinenest_interactions_${uId}`, JSON.stringify(data));
        }
      })
      .catch((err) => console.error('Etkileşimler API hatası:', err));
  }, [user]);

  const isInWatchlist = (slugOrId) => {
    if (!slugOrId) return false;
    const targetId = String(slugOrId);
    const item = interactions.find((i) => String(i.movieId) === targetId);
    return item ? Boolean(item.isInWatchlist) : false;
  };

  const isMovieLiked = (slugOrId) => {
    if (!slugOrId) return false;
    const targetId = String(slugOrId);
    const item = interactions.find((i) => String(i.movieId) === targetId);
    return item ? Boolean(item.isLiked) : false;
  };

 const toggleWatchlist = async (slugOrId) => {
    if (!user) return alert('Lütfen önce giriş yapın.');
    const movieId = parseInt(slugOrId, 10);
    try {
      const res = await fetch('http://localhost:5080/api/interactions/toggle-watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId: currentUserId })
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) => {
          const exists = prev.some((i) => i.movieId === movieId);
          const updated = exists
            ? prev.map((i) => (i.movieId === movieId ? { ...i, isInWatchlist: data.isInWatchlist } : i))
            : [...prev, { movieId, isLiked: false, isInWatchlist: data.isInWatchlist }];
          
          // localStorage'a güncel diziyi burada mühürlüyoruz
          localStorage.setItem(`cinenest_interactions_${user.id || user.username}`, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Watchlist güncellenemedi:', err);
    }
  };

  const toggleLike = async (slugOrId) => {
    if (!user) return alert('Lütfen önce giriş yapın.');
    const movieId = parseInt(slugOrId, 10);
    try {
      const res = await fetch('http://localhost:5080/api/interactions/toggle-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId: currentUserId })
      });
      if (res.ok) {
        const data = await res.json();
        setInteractions((prev) => {
          const exists = prev.some((i) => i.movieId === movieId);
          const updated = exists
            ? prev.map((i) => (i.movieId === movieId ? { ...i, isLiked: data.isLiked } : i))
            : [...prev, { movieId, isLiked: data.isLiked, isInWatchlist: false }];
          
          // localStorage'a güncel diziyi burada mühürlüyoruz
          localStorage.setItem(`cinenest_interactions_${user.id || user.username}`, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Like güncellenemedi:', err);
    }
  };

  const createCustomList = (title, description = '', selectedIds = []) => {
    if (!title.trim() || !user) return;
    const newList = {
      id: `list-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      movieSlugs: selectedIds.map(String)
    };
    const updated = [newList, ...customLists];
    setCustomLists(updated);
    localStorage.setItem(`cinenest_custom_lists_${user.id}`, JSON.stringify(updated));
  };

  const deleteCustomList = (listId) => {
    if (!user) return;
    const updated = customLists.filter((l) => l.id !== listId);
    setCustomLists(updated);
    localStorage.setItem(`cinenest_custom_lists_${user.id}`, JSON.stringify(updated));
  };

  // Kullanıcı İncelemeleri
  const [userReviews, setUserReviews] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return [];
    try {
      const uId = JSON.parse(savedUser).id;
      const saved = localStorage.getItem(`movie_user_reviews_${uId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`movie_user_reviews_${user.id}`);
      setUserReviews(saved ? JSON.parse(saved) : []);
    } else {
      setUserReviews([]);
    }
  }, [user]);

  const addReview = (reviewData) => {
    if (!user) return;
    const newReview = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem(`movie_user_reviews_${user.id}`, JSON.stringify(updated));
  };

  const deleteReview = (id) => {
    if (!user) return;
    const updated = userReviews.filter((r) => r.id !== id);
    setUserReviews(updated);
    localStorage.setItem(`movie_user_reviews_${user.id}`, JSON.stringify(updated));
  };

  const [lang, setLang] = useState('TR');
  const [cinemaMode, setCinemaMode] = useState(false);
  const [followingList, setFollowingList] = useState([]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setInteractions([]);
    setCustomLists([]);
    setUserReviews([]);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        loadingMovies,
        fetchMovies,
        currentUser: user, // 👈 Eski uyumluluk için currentUser alias olarak user'ı döndürüyoruz
        updateProfile,
        followingList,
        customLists,
        createCustomList,
        deleteCustomList,
        logout,
        watchlist: interactions.filter((i) => i.isInWatchlist).map((i) => String(i.movieId)),
        likedMovies: interactions.filter((i) => i.isLiked).map((i) => String(i.movieId)),
        userReviews,
        addReview,
        deleteReview,
        toggleWatchlist,
        toggleLike,
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