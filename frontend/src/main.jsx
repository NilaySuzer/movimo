import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MovieProvider } from './context/MovieContext';
import { ToastProvider } from './context/ToastContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
        <MovieProvider>
          <App />
          </MovieProvider>
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);