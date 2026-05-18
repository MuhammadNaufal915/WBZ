import React from 'react';
import { useAuth } from '../../context/AuthContext';

function StatCard({ icon, value, label }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__glow" aria-hidden="true" />
      <div className="admin-stat-card__icon">{icon}</div>
      <div className="admin-stat-card__value">{value}</div>
      <div className="admin-stat-card__label">{label}</div>
    </div>
  );
}

function QuickAction({ icon, label, desc, onClick }) {
  return (
    <button
      className="admin-list-item"
      onClick={onClick}
      style={{ cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left' }}
    >
      <div className="admin-list-item__icon">{icon}</div>
      <div className="admin-list-item__body">
        <div className="admin-list-item__title">{label}</div>
        <div className="admin-list-item__desc">{desc}</div>
      </div>
      <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

export default function DashOverview({ onNavigate }) {
  const { admin } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Welcome banner */}
      <div className="admin-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #111 60%, rgba(255,85,0,0.06))', borderColor: 'rgba(255,85,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#FF5500', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {greeting} 👋
            </p>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.03em' }}>
              Welcome back, {admin?.name?.split(' ')[0] || 'Admin'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.4rem' }}>
              Manage your WBZ Creative Studio content from here.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#333' }}>Last login</div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.15rem' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <StatCard
          value="4"
          label="Content Sections"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          value="6"
          label="Services Listed"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
        />
        <StatCard
          value="5"
          label="Portfolio Works"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
        />
        <StatCard
          value="∞"
          label="Possibilities"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
        />
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <div className="admin-card__title">Quick Actions</div>
        <div className="admin-list">
          <QuickAction
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
            label="Edit Hero Section"
            desc="Update headline, subtitle and CTA text"
            onClick={() => onNavigate('hero')}
          />
          <QuickAction
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
            label="Manage Portfolio"
            desc="Add or edit portfolio works & images"
            onClick={() => onNavigate('works')}
          />
          <QuickAction
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            label="Edit Services"
            desc="Update service offerings and descriptions"
            onClick={() => onNavigate('services')}
          />
          <QuickAction
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            label="Edit About Section"
            desc="Update about text and stats"
            onClick={() => onNavigate('about')}
          />
        </div>
      </div>
    </div>
  );
}
