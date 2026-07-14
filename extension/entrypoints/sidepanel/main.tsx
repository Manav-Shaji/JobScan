/**
 * ------------------------------------------------------------
 * File: main.tsx
 * 
 * Purpose:
 * Entrypoint for rendering the Chrome Extension side panel UI.
 * 
 * Responsibilities:
 * • Initialize React DOM and mount the App component
 * 
 * Used By:
 * • WXT Build System
 * ------------------------------------------------------------
 */

/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/app/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
