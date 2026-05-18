import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import DashOverview from '../components/admin/DashOverview';
import HeroEditor from '../components/admin/HeroEditor';
import AboutEditor from '../components/admin/AboutEditor';
import ServicesEditor from '../components/admin/ServicesEditor';
import WorksEditor from '../components/admin/WorksEditor';
import SettingsPanel from '../components/admin/SettingsPanel';
import '../styles/admin.css';

const PAGE_TITLES = {
  overview: { title: 'Dashboard',      crumb: 'Admin / Overview' },
  hero:     { title: 'Hero Section',   crumb: 'Admin / Content / Hero' },
  about:    { title: 'About Section',  crumb: 'Admin / Content / About' },
  services: { title: 'Services',        crumb: 'Admin / Content / Services' },
  works:    { title: 'Portfolio Works', crumb: 'Admin / Content / Works' },
  settings: { title: 'Settings',        crumb: 'Admin / Settings' },
};

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [active, setActive] = useState('overview');

  // Show nothing while token is being verified
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #1e1e1e', borderTopColor: '#FF5500', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: '#444', fontSize: '0.85rem' }}>Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderContent = () => {
    switch (active) {
      case 'hero':     return <HeroEditor />;
      case 'about':    return <AboutEditor />;
      case 'services': return <ServicesEditor />;
      case 'works':    return <WorksEditor />;
      case 'settings': return <SettingsPanel />;
      default:         return <DashOverview onNavigate={setActive} />;
    }
  };

  const meta = PAGE_TITLES[active] || PAGE_TITLES.overview;

  return (
    <div className="admin">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="admin-main">
        {/* Top header bar */}
        <header className="admin-header">
          <div>
            <div className="admin-header__title">{meta.title}</div>
            <div className="admin-header__breadcrumb">{meta.crumb}</div>
          </div>
          <div className="admin-header__live">
            <span className="admin-header__live-dot" />
            <Link to="/" target="_blank" style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#FF5500'}
              onMouseLeave={e => e.target.style.color = '#444'}>
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content" id="admin-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
