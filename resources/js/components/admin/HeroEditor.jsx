import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      <span className="admin-toast__icon">
        {type === 'success'
          ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        }
      </span>
      {msg}
    </div>
  );
}

export default function HeroEditor() {
  const [data, setData]     = useState({ headline: '', subtitle: '', cta_primary: '', cta_secondary: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    axios.get('/content/hero').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/admin/content/hero', data);
      setToast({ msg: 'Hero section saved!', type: 'success' });
    } catch {
      setToast({ msg: 'Gagal menyimpan. Coba lagi.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: '#555', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="admin-page-header">
        <h2>Hero Section</h2>
        <p>Edit the main headline, subtitle, and call-to-action buttons on the landing page.</p>
      </div>
      <div className="admin-card">
        <div className="admin-card__title">Content Editor</div>
        <form className="admin-form" onSubmit={save}>
          <div className="admin-field">
            <label className="admin-label">Headline <span style={{ color: '#333', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(use \n for line break)</span></label>
            <textarea className="admin-textarea" style={{ minHeight: 80 }}
              value={data.headline} onChange={e => setData(p => ({ ...p, headline: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Subtitle</label>
            <textarea className="admin-textarea"
              value={data.subtitle} onChange={e => setData(p => ({ ...p, subtitle: e.target.value }))} />
          </div>
          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-label">Primary CTA Label</label>
              <input className="admin-input" value={data.cta_primary}
                onChange={e => setData(p => ({ ...p, cta_primary: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Secondary CTA Label</label>
              <input className="admin-input" value={data.cta_secondary}
                onChange={e => setData(p => ({ ...p, cta_secondary: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving && <span className="admin-spinner" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
