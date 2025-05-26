// src/bootstrap.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
};

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.getElementById('root');
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };