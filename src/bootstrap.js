import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GameCenter from './components/GameCenter';

// For standalone development/testing
ReactDOM.render(
  <React.StrictMode>
    <GameCenter />
  </React.StrictMode>,
  document.getElementById('root')
);