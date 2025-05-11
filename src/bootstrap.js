// src/bootstrap.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GameCenter from './components/GameCenter';

// For standalone development/testing
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameCenter />
  </React.StrictMode>
);