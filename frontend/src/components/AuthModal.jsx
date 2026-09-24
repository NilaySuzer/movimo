import React, { useState } from 'react';
import { X, Mail, Lock, User, Clapperboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import '../styles/auth.css';
import { useAuth } from '../context/AuthContext';
const API_URL = 'http://localhost:5080/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
const { login } = useAuth();
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Hata ve Yüklenme State'leri
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          setError('Lütfen tüm alanları doldurun.');
          setLoading(false);
          return;
        }

        // Backend Login API İsteği
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        
        if (response.data.user) {
          // Kullanıcı bilgisini localStorage'a kaydedelim
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if (onAuthSuccess) onAuthSuccess(response.data.user);
        }
        login(response.data.user);
        setLoading(false);
        onClose();
      } else {
        if (!name || !email || !password) {
          setError('Lütfen tüm alanları doldurun.');
          setLoading(false);
          return;
        }

        // Backend Register API İsteği
        await axios.post(`${API_URL}/auth/register`, {
          username: name.toLowerCase().replace(/\s+/g, ''),
          fullName: name,
          email,
          password
        });

        setLoading(false);
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setMode('login'); // Kayıttan sonra giriş sekmesine atalım
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
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

        {/* Hata Mesajı Alanı */}
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Sekmeler (Tabs) */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Giriş Yap
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
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
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Şifre sıfırlama yakında aktif olacak!"); }} className="forgot-link">
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

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            <span>{loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur')}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Alt Bilgi */}
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Hesabın yok mu?{' '}
              <button type="button" className="switch-link" onClick={() => { setMode('register'); setError(''); }}>
                Hemen Kaydol
              </button>
            </p>
          ) : (
            <p>
              Zaten üye misin?{' '}
              <button type="button" className="switch-link" onClick={() => { setMode('login'); setError(''); }}>
                Giriş Yap
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}