import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      <span className="admin-toast__icon">
        {type === 'success'
          ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      </span>
      {msg}
    </div>
  );
}

export default function AboutEditor() {
  const [data, setData]       = useState({ title: '', description: '', stats: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    axios.get('/content/about').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStat = (i, field, val) => {
    setData(p => {
      const stats = [...p.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...p, stats };
    });
  };

  const addStat = () => setData(p => ({ ...p, stats: [...p.stats, { number: '', label: '' }] }));
  const removeStat = (i) => setData(p => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/admin/content/about', data);
      setToast({ msg: 'About section saved!', type: 'success' });
    } catch {
      setToast({ msg: 'Gagal menyimpan.', type: 'error' });
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ color: '#555', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="admin-page-header">
        <h2>About Section</h2>
        <p>Edit the about text, title, and statistics shown on the landing page.</p>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card__title">About Content</div>
        <form className="admin-form" onSubmit={save}>
          <div className="admin-field">
            <label className="admin-label">Section Title</label>
            <input className="admin-input" value={data.title}
              onChange={e => setData(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" style={{ minHeight: 120 }} value={data.description}
              onChange={e => setData(p => ({ ...p, description: e.target.value }))} />
          </div>

          {/* Stats */}
          <div>
            <label className="admin-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Statistics</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.stats.map((stat, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input className="admin-input" placeholder="50+" value={stat.number}
                    onChange={e => updateStat(i, 'number', e.target.value)} style={{ width: '120px', flex: 'none' }} />
                  <input className="admin-input" placeholder="Projects Done" value={stat.label}
                    onChange={e => updateStat(i, 'label', e.target.value)} />
                  <button type="button" className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => removeStat(i)} style={{ flexShrink: 0 }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={addStat} style={{ alignSelf: 'flex-start' }}>
                + Add Stat
              </button>
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
