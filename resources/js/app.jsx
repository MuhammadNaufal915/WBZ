import React from 'react';
import { createRoot } from 'react-dom/client';
import MainApp from './MainApp.jsx';
import './styles/globals.css';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);
  root.render(<MainApp />);
} else {
  console.error("Root container '#app' not found");
}
