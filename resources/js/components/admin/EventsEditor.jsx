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

function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (event) {
      return {
        title: '',
        date_day: '',
        date_month: '',
        time: '',
        location: '',
        desc: '',
        status: 'active',
        ...event
      };
    }
    return {
      title: '',
      date_day: '',
      date_month: '',
      time: '',
      location: '',
      desc: '',
      status: 'active'
    };
  });

  const handleSave = () => {
    if (!form.title || !form.date_day || !form.date_month) {
      alert('Title, Day, and Month are required!');
      return;
    }
    onSave(form);
  };

  return (
    <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal" style={{ maxWidth: 600 }}>
        <div className="admin-modal__header">
          <span className="admin-modal__title">{event ? 'Edit Event' : 'Add Event'}</span>
          <button className="admin-modal__close" onClick={onClose}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="admin-modal__body">
          <div className="admin-form">
            {/* Title */}
            <div className="admin-field">
              <label className="admin-label">Event Title</label>
              <input className="admin-input" placeholder="e.g. WBZ Block Party Vol. 5" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            {/* Date Day + Month */}
            <div className="admin-form__row">
              <div className="admin-field">
                <label className="admin-label">Date Day (Number)</label>
                <input className="admin-input" placeholder="e.g. 12" value={form.date_day}
                  onChange={e => setForm(p => ({ ...p, date_day: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Date Month (Abbr)</label>
                <input className="admin-input" placeholder="e.g. JUN" value={form.date_month}
                  onChange={e => setForm(p => ({ ...p, date_month: e.target.value.toUpperCase() }))} />
              </div>
            </div>

            {/* Time + Location */}
            <div className="admin-form__row">
              <div className="admin-field">
                <label className="admin-label">Time</label>
                <input className="admin-input" placeholder="e.g. 17:00 - LATE" value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Location</label>
                <input className="admin-input" placeholder="e.g. Laswi Heritage, Bandung" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="admin-field">
              <label className="admin-label">Status</label>
              <select className="admin-input" value={form.status} style={{ width: '100%' }}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Active (Upcoming)</option>
                <option value="finished">Finished (Archived/Dimmed)</option>
              </select>
            </div>

            {/* Description */}
            <div className="admin-field">
              <label className="admin-label">Short Description</label>
              <textarea className="admin-input" placeholder="Give brief event details..." rows={3}
                style={{ resize: 'vertical' }} value={form.desc}
                onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave}>
            {event ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsEditor() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    axios.get('/content/events')
      .then(r => setItems(r.data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveAll = async (newItems) => {
    setSaving(true);
    try {
      await axios.put('/admin/content/events', { items: newItems });
      setToast({ msg: 'Events calendar updated!', type: 'success' });
    } catch {
      setToast({ msg: 'Failed to save events.', type: 'error' });
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
    if (!confirm('Remove this event from calendar?')) return;
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    saveAll(next);
  };

  if (loading) return <div style={{ color: '#555', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && (
        <EventModal
          event={modal.mode === 'edit' ? modal.event : null}
          onSave={handleSaveModal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="admin-page-header">
        <h2>Events Calendar</h2>
        <p>Add, edit, or remove upcoming and finished events displayed on the landing page.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="admin-card__title" style={{ margin: 0 }}>All Events</div>
          <button className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={() => setModal({ mode: 'add' })}>+ Add Event</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((event, i) => {
            const isFinished = event.status === 'finished';

            let statusLabel = 'Active';
            let statusColor = '#FF5500';
            if (isFinished) { statusLabel = 'Finished'; statusColor = '#555'; }

            return (
              <div key={event.id || i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                border: '1px solid #1E1E1E', 
                borderRadius: '8px', 
                padding: '1rem 1.25rem',
                background: '#111',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ 
                    background: '#181818', 
                    borderRadius: '6px', 
                    padding: '0.4rem 0.8rem', 
                    textAlign: 'center', 
                    minWidth: '65px',
                    border: '1px solid #222'
                  }}>
                    <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, lineHeight: 1 }}>{event.date_day}</div>
                    <div style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>{event.date_month}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{event.title}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        color: statusColor, 
                        border: `1px solid ${statusColor}44`,
                        background: `${statusColor}11`,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>{statusLabel}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      {event.time} &bull; {event.location}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="admin-btn admin-btn--secondary admin-btn--sm"
                    onClick={() => setModal({ mode: 'edit', index: i, event })}>Edit</button>
                  <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => remove(i)}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666', border: '2px dashed #1E1E1E', borderRadius: '8px' }}>
              No events found. Click "+ Add Event" to add your first event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
