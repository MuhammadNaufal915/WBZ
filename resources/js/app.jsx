import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainApp from './MainApp.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page — public */}
          <Route path="/" element={<MainApp />} />

          {/* Admin login page */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin dashboard — protected inside the component */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
} else {
  console.error("Root container '#app' not found");
}
