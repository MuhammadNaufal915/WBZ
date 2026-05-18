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

const ICONS = ['Palette', 'Monitor', 'Camera', 'Film', 'PenTool', 'TrendingUp', 'Code', 'Layers', 'Box', 'Globe'];

function ServiceModal({ service, onSave, onClose }) {
  const [form, setForm] = useState(service || { icon: 'Palette', title: '', description: '' });
  return (
    <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal__header">
          <span className="admin-modal__title">{service ? 'Edit Service' : 'Add Service'}</span>
          <button className="admin-modal__close" onClick={onClose}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="admin-modal__body">
          <div className="admin-form">
            <div className="admin-field">
              <label className="admin-label">Icon Name</label>
              <select className="admin-select" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Service Title</label>
              <input className="admin-input" placeholder="e.g. Brand Identity" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" placeholder="Short description..." value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--primary" onClick={() => onSave(form)}>
            {service ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesEditor() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [modal, setModal]     = useState(null); // null | { mode:'add'|'edit', index?, service? }
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    axios.get('/content/services').then(r => setItems(r.data.items || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveAll = async (newItems) => {
    setSaving(true);
    try {
      await axios.put('/admin/content/services', { items: newItems });
      setToast({ msg: 'Services saved!', type: 'success' });
    } catch {
      setToast({ msg: 'Gagal menyimpan.', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleSaveModal = (form) => {
    let next;
    if (modal.mode === 'add') {
      next = [...items, { ...form, id: Date.now() }];
    } else {
      next = items.map((it, i) => i === modal.index ? { ...it, ...form } : it);
    }
    setItems(next);
    setModal(null);
    saveAll(next);
  };

  const remove = (i) => {
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    saveAll(next);
  };

  if (loading) return <div style={{ color: '#555', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && (
        <ServiceModal
          service={modal.mode === 'edit' ? modal.service : null}
          onSave={handleSaveModal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="admin-page-header">
        <h2>Services</h2>
        <p>Add, edit or remove the services displayed on the landing page.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="admin-card__title" style={{ margin: 0 }}>All Services</div>
          <button className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={() => setModal({ mode: 'add' })}>
            + Add Service
          </button>
        </div>

        <div className="admin-list">
          {items.map((svc, i) => (
            <div key={svc.id || i} className="admin-list-item">
              <div className="admin-list-item__icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="admin-list-item__body">
                <div className="admin-list-item__title">{svc.title}</div>
                <div className="admin-list-item__desc">{svc.description}</div>
              </div>
              <div className="admin-list-item__actions">
                <button className="admin-btn admin-btn--secondary admin-btn--sm"
                  onClick={() => setModal({ mode: 'edit', index: i, service: svc })}>Edit</button>
                <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => remove(i)}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: '#333', fontSize: '0.85rem', padding: '1rem 0' }}>No services yet. Add one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
