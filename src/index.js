import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext.jsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
      <CartProvider>
    <App />
    </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
