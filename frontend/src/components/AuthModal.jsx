import React, { useState } from 'react';
import { X, Mail, Lock, User, Clapperboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import '../styles/auth.css';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, register } = useMovies();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) return;
      login(email, password);
      onClose();
    } else {
      if (!name || !email || !password) return;
      register(name, email, password);
      onClose();
    }
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Kapat Butonu */}
        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Logo & Başlık */}
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <Clapperboard size={28} color="#f5c518" />
          </div>
          <h2>{mode === 'login' ? 'Tekrar Hoş Geldin!' : 'Aramıza Katıl!'}</h2>
          <p className="auth-subtitle">
            {mode === 'login' 
              ? 'Film listelerini, incelemelerini ve puanlarını yönet.' 
              : 'Favori filmlerini keşfet, incelemeler yaz ve topluluğa katıl.'}
          </p>
        </div>

        {/* Sekmeler (Tabs) */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Giriş Yap
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-input-group">
              <label>Ad Soyad</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Nilay Süzer" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>E-Posta</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="ornek@movie.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="label-row">
              <label>Şifre</label>
              {mode === 'login' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Şifre sıfırlama bağlantısı gönderildi!"); }} className="forgot-link">
                  Şifremi Unuttum?
                </a>
              )}
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            <span>{mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Alt Bilgi */}
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Hesabın yok mu?{' '}
              <button type="button" className="switch-link" onClick={() => setMode('register')}>
                Hemen Kaydol
              </button>
            </p>
          ) : (
            <p>
              Zaten üye misin?{' '}
              <button type="button" className="switch-link" onClick={() => setMode('login')}>
                Giriş Yap
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}