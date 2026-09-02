import React from 'react';
import { Film, Sparkles, Heart, Code2, ShieldCheck, Users } from 'lucide-react';
import '../styles/about.css';

export default function AboutPage() {
  const highlights = [
    {
      icon: <Film size={26} color="#f5c518" />,
      title: "Geniş Sinema Arşivi",
      desc: "Aksiyondan bilim kurguya, klasikten animasyona kadar özenle seçilmiş film incelemeleri ve fragmanlar."
    },
    {
      icon: <Sparkles size={26} color="#00d2d3" />,
      title: "Mood & Akıllı Öneri",
      desc: "Ruh haline göre ne izleyeceğini bilemediğin anlar için tek tıkla sana en uygun başyapıtı getiren sistem."
    },
    {
      icon: <Heart size={26} color="#ff4757" />,
      title: "Topluluk & İncelemeler",
      desc: "Letterboxd estetiğinde şeffaf kullanıcı yorumları, izleme listeleri ve puanlama deneyimi."
    },
    {
      icon: <ShieldCheck size={26} color="#2ed573" />,
      title: "Modern Cam Tasarım",
      desc: "Göz yormayan koyu tema, sinema modu ve derinlik katan glassmorphism arayüz dili."
    }
  ];

  return (
    <div className="about-wrapper">
      <div className="about-hero">
        <span className="about-pill">🍿 Sinema & Teknoloji</span>
        <h1 className="about-title">
          Sinemaseverler İçin <span className="highlight-text">Yeni Nesil</span> Film Köşesi
        </h1>
        <p className="about-subtitle">
          Movie.com; karmaşık arayüzlerden uzak, filmleri keşfetmeyi, puanlamayı ve düşüncelerini özgürce paylaşmayı keyifli hale getiren bir sinema platformudur.
        </p>
      </div>

      <div className="about-content-container">
        {/* Vizyon Kartı */}
        <div className="vision-card glass-panel">
          <div className="vision-text">
            <h2>Neden Movie.com?</h2>
            <p>
              "Bu akşam ne izlesem?" sorusu çoğu zaman bir filmin süresi kadar vakit alabiliyor. Amacımız, sinema tutkunlarının aradıkları türe, hissettikleri ruh haline veya topluluğun en çok konuştuğu trendlere saniyeler içinde ulaşabilmesini sağlamak.
            </p>
            <p>
              Her film için resmi fragmanlar, yayın sağlayıcıları (Plex TV vb.) ve gerçek sinemasever yorumlarıyla zenginleştirilmiş samimi bir dijital sinema günlüğü sunuyoruz.
            </p>
          </div>
          <div className="vision-stats">
            <div className="v-stat">
              <strong>30+</strong>
              <span>Özenle Seçilmiş Film</span>
            </div>
            <div className="v-stat">
              <strong>6</strong>
              <span>Farklı Tür Kategorisi</span>
            </div>
            <div className="v-stat">
              <strong>%100</strong>
              <span>Tarafsız İnceleme</span>
            </div>
          </div>
        </div>

        {/* Öne Çıkan Özellikler */}
        <div className="features-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className="feature-item glass-panel">
              <div className="feature-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Geliştirici & Teknoloji Kartı */}
        <div className="tech-stack-card glass-panel">
          <div className="tech-header">
            <Code2 size={24} color="#f5c518" />
            <h3>Teknoloji Omurgası</h3>
          </div>
          <p>
            Bu platform; saf performans ve şık kullanıcı deneyimi için <strong>React</strong>, <strong>Vite</strong>, <strong>React Router</strong> ve modern <strong>CSS Glassmorphism</strong> mimarisi kullanılarak geliştirilmiştir. İlerleyen aşamada kullanıcı oturumu ve veri tabanı yönetimi için tam teşekküllü bir RESTful API mimarisi ile desteklenecektir.
          </p>
          <div className="tech-badges">
            <span>React 18</span>
            <span>Vite</span>
            <span>Lucide Icons</span>
            <span>React Router v6</span>
            <span>CSS3 Backdrop-Filter</span>
          </div>
        </div>
      </div>
    </div>
  );
}