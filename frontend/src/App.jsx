import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import './styles/global.css';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import MoodPage from './pages/MoodPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/contact" element={<ContactPage />} /> 
        <Route path="/mood/:moodKey" element={<MoodPage key={location.pathname} />} />
        <Route path="/category/:categoryId" element={<CategoryPage key={location.pathname} />} /> 
      </Routes>
      <Footer />
    </>
  );
}