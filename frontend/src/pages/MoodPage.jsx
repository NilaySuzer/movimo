import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Sparkles, Film } from 'lucide-react';
import { movies } from '../data/moviesData';
import '../styles/categoryPage.css';

// Senin moodList'indeki id'ler: mindblown, feelgood, romantic, adrenaline, spooky
const moodConfigs = {
  mindblown: {
    title: 'Beyin Yakan & Zihin Bükücü 🤯',
    desc: 'Zaman paradoksları, gerçeklik algısını sorgulatan senaryolar ve ters köşe finaller.',
    color: '#10ac84',
    filterFn: (m) => 
      m.category === 'scifi' || 
      m.category === 'sci-fi' || 
      ['inception', 'interstellar', 'tenet', 'matrix', 'shutter-island', 'fight-club'].includes(m.slug)
  },
  feelgood: {
    title: 'Kafa Dağıtmalık & Keyifli ☀️',
    desc: 'Yüzünde tebessüm bırakacak, sıcacık ve pozitif hissettiren sinema seçkisi.',
    color: '#00d2d3',
    filterFn: (m) => 
      m.category === 'comedy' || 
      m.category === 'animation' || 
      ['up', 'coco', 'spirited-away'].includes(m.slug)
  },
  romantic: {
    title: 'Duygusal & Ağlatmalık 🥺',
    desc: 'Kalbe dokunan hikayeler, derin bağlar ve melankolik başyapıtlar.',
    color: '#ff7675',
    filterFn: (m) => 
      m.category === 'romantic' || 
      m.category === 'drama' || 
      ['corpse-bride', 'la-la-land', 'coco', 'interstellar'].includes(m.slug)
  },
  adrenaline: {
    title: 'Saf Adrenalin & Tansiyon ⚡',
    desc: 'Nefes kesen aksiyon, tempo ve yüksek prodüksiyonlu sahneler.',
    color: '#ff9f43',
    filterFn: (m) => 
      m.category === 'action' || 
      ['dark-knight', 'matrix', 'top-gun-maverick', 'mad-max', 'tenet'].includes(m.slug)
  },
  spooky: {
    title: 'Karanlık, Gerilim & Spooky 🕯️',
    desc: 'Gotik atmosferler, tüyler ürpertici gizemler ve tekinsiz yolculuklar.',
    color: '#a29bfe',
    filterFn: (m) => 
      m.category === 'horror' || 
      m.category === 'psychological' || 
      ['corpse-bride', 'dark-knight', 'fight-club', 'se7en'].includes(m.slug)
  }
};

export default function MoodPage() {
  const params = useParams();
  const navigate = useNavigate();

  // URL'deki parametreyi hangi isimle gelirse gelsin (moodKey, id, slug) yakala:
  const activeKey = (params.moodKey || params.id || Object.values(params)[0] || 'feelgood').toLowerCase();

  // İlgili mod ayarlarını çek
  const config = moodConfigs[activeKey] || moodConfigs.feelgood;

  // Sayfa her değiştiğinde yukarı kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeKey]);

  // Filmleri filtrele
  const moodMovies = movies.filter(config.filterFn);

  return (
    <div className="category-page-wrapper">
      <div className="category-top-bar">
        <button className="back-btn glass-panel" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Ana Sayfa</span>
        </button>
      </div>

      <header className="category-header">
        <span className="category-badge" style={{ borderColor: config.color, color: config.color }}>
          <Sparkles size={14} style={{ marginRight: 6 }} /> Ruh Hali Modu
        </span>
        <h1 style={{ textShadow: `0 0 20px ${config.color}44` }}>{config.title}</h1>
        <p>{config.desc}</p>
      </header>

      <main className="category-movies-grid">
        {moodMovies.length > 0 ? (
          moodMovies.map((movie) => (
            <Link to={`/movie/${movie.slug}`} key={movie.slug} className="cat-movie-card glass-panel">
              <div className="card-img-wrap">
                <img src={movie.poster} alt={movie.title} />
                <span className="rating-pill">
                  <Star size={13} fill="#f5c518" color="#f5c518" /> {movie.imdb || 'N/A'}
                </span>
              </div>
              <div className="card-meta">
                <h4>{movie.title}</h4>
                <span className="genre-tag" style={{ color: config.color }}>
                  {movie.category || 'Featured'}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-category glass-panel">
            <Film size={40} color="#777" />
            <p>Bu ruh haline uygun film bulunamadı.</p>
          </div>
        )}
      </main>

   
    </div>
  );
}