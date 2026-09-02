import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import './styles/global.css';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>
      <Footer />
    </>
  );
}