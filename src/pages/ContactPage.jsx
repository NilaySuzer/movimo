import React, { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import '../styles/contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Film Tavsiyesi',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-hero">
        <span className="contact-pill">💬 Bize Ulaşın</span>
        <h1>Bizimle İletişime Geçin</h1>
        <p>
          Film önerilerin, platform hakkındaki düşüncelerin veya hata bildirimlerin için bize dilediğin zaman yazabilirsin.
        </p>
      </div>

      <div className="contact-main-card glass-panel">
        <div className="contact-left-info">
          <h2>Birlikte Sinema Konuşalım</h2>
          <p>
            Arşivimize eklenmesini istediğin bir film mi var? Yoksa arayüzle ilgili harika bir önerin mi var? Mesajını sabırsızlıkla bekliyoruz.
          </p>

          <div className="contact-meta-list">
            <div className="meta-item">
              <Mail size={20} color="#f5c518" />
              <div>
                <strong>E-Posta:</strong>
                <span>contact@movimo.com</span>
              </div>
            </div>
            <div className="meta-item">
              <MapPin size={20} color="#f5c518" />
              <div>
                <strong>Topluluk Merkezi:</strong>
                <span>İstanbul / Kocaeli, Türkiye</span>
              </div>
            </div>
            <div className="meta-item">
              <Sparkles size={20} color="#f5c518" />
              <div>
                <strong>Yanıt Süresi:</strong>
                <span>Genellikle 24 saat içinde</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right-form">
          {isSubmitted ? (
            <div className="submitted-success-box">
              <CheckCircle2 size={54} color="#2ed573" />
              <h3>Mesajınız Alındı!</h3>
              <p>
                Teşekkürler <strong>{formData.name}</strong>, mesajın başarıyla bize ulaştı. En kısa sürede geri dönüş yapacağız! 🍿
              </p>
              <button 
                className="reset-form-btn" 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Film Tavsiyesi', message: '' });
                }}
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-field">
                <label>Adınız & Soyadınız:</label>
                <input
                  type="text"
                  placeholder="Örn: Nilay Süzer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>E-Posta Adresiniz:</label>
                <input
                  type="email"
                  placeholder="adiniz@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Konu:</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Film Tavsiyesi">🎬 Film Tavsiyesi</option>
                  <option value="Hata Bildirimi">🐞 Hata Bildirimi</option>
                  <option value="Topluluk & İşbirliği">🤝 Topluluk & İşbirliği</option>
                  <option value="Genel Görüş">💭 Genel Görüş</option>
                </select>
              </div>

              <div className="form-field">
                <label>Mesajınız:</label>
                <textarea
                  rows="5"
                  placeholder="Düşüncelerini ve önerilerini bizimle paylaş..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={16} />
                <span>Mesajı Gönder</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}