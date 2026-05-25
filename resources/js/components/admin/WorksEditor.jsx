import React, { useState, useEffect, useRef } from 'react';
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

function WorkModal({ work, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (work) {
      return {
        image: '',
        heroImage: '',
        detailImage: '',
        title: '',
        category: '',
        tags: '',
        description: '',
        client: '',
        year: '',
        ...work
      };
    }
    return { image: '', heroImage: '', detailImage: '', title: '', category: '', tags: '', description: '', client: '', year: '' };
  });
  const [uploading, setUploading] = useState(null); // stores the field currently uploading, e.g. 'image', 'heroImage', 'detailImage'

  const thumbFileRef = useRef();
  const heroFileRef = useRef();
  const detailFileRef = useRef();

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await axios.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(p => ({ ...p, [field]: res.data.url }));
    } catch {
      alert('Upload gagal. Coba lagi.');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = () => {
    const tags = typeof form.tags === 'string'
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : form.tags;
    onSave({ ...form, tags });
  };

  const tagsStr = Array.isArray(form.tags) ? form.tags.join(', ') : form.tags;

  const renderImageField = (label, field, fileRef) => {
    const isUploading = uploading === field;
    const value = form[field] || '';

    return (
      <div className="admin-field" style={{ flex: 1, minWidth: '150px' }}>
        <label className="admin-label" style={{ fontSize: '0.75rem' }}>{label}</label>
        <div className="admin-upload-zone" onClick={() => fileRef.current.click()} style={{ minHeight: '100px', padding: '0.5rem' }}>
          {value ? (
            <img src={value} alt={label} style={{ maxHeight: '90px', maxWidth: '100%', borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div className="admin-upload-zone__icon" style={{ marginBottom: 0 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <div className="admin-upload-zone__text" style={{ fontSize: '0.7rem', color: '#888' }}>Upload Image</div>
            </div>
          )}
          {isUploading && <div style={{ marginTop: '0.25rem', color: '#FF5500', fontSize: '0.7rem' }}>Uploading...</div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUpload(e, field)} />
        {value && (
          <input className="admin-input" style={{ marginTop: '0.4rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }} placeholder="Image URL"
            value={value} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
        )}
      </div>
    );
  };

  return (
    <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal" style={{ maxWidth: 680 }}>
        <div className="admin-modal__header">
          <span className="admin-modal__title">{work ? 'Edit Work' : 'Add Work'}</span>
          <button className="admin-modal__close" onClick={onClose}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="admin-modal__body">
          <div className="admin-form">

            {/* ── Image Uploads Grid ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              {renderImageField("Thumbnail (Landing Card)", "image", thumbFileRef)}
              {renderImageField("Hero Banner (Detail Top)", "heroImage", heroFileRef)}
              {renderImageField("Content Image (Detail About)", "detailImage", detailFileRef)}
            </div>

            {/* ── Title ── */}
            <div className="admin-field">
              <label className="admin-label">Project Title</label>
              <input className="admin-input" placeholder="e.g. Langit Coffee" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            {/* ── Category + Tags ── */}
            <div className="admin-form__row">
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <input className="admin-input" placeholder="e.g. Brand Identity" value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Tags <span style={{ color: '#333', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(comma separated)</span></label>
                <input className="admin-input" placeholder="Branding, Print" value={tagsStr}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              </div>
            </div>

            {/* ── Client + Year ── */}
            <div className="admin-form__row">
              <div className="admin-field">
                <label className="admin-label">Client Name</label>
                <input className="admin-input" placeholder="e.g. Langit Coffee Co." value={form.client || ''}
                  onChange={e => setForm(p => ({ ...p, client: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Year</label>
                <input className="admin-input" placeholder="e.g. 2024" value={form.year || ''}
                  onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              </div>
            </div>

            {/* ── Description ── */}
            <div className="admin-field">
              <label className="admin-label">
                Project Description
                <span style={{ color: '#444', textTransform: 'none', fontWeight: 400, letterSpacing: 0, marginLeft: '0.4rem' }}>
                  — ditampilkan di halaman detail
                </span>
              </label>
              <textarea
                className="admin-input"
                placeholder="Ceritakan project ini — proses, hasil, dan dampaknya..."
                rows={4}
                style={{ resize: 'vertical', lineHeight: 1.7 }}
                value={form.description || ''}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

          </div>
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={!!uploading}>
            {work ? 'Update Work' : 'Add Work'}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function WorksEditor() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    axios.get('/content/works').then(r => setItems(r.data.items || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveAll = async (newItems) => {
    setSaving(true);
    try {
      await axios.put('/admin/content/works', { items: newItems });
      setToast({ msg: 'Portfolio saved!', type: 'success' });
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
    if (!confirm('Hapus karya ini?')) return;
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    saveAll(next);
  };

  if (loading) return <div style={{ color: '#555', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && (
        <WorkModal
          work={modal.mode === 'edit' ? modal.work : null}
          onSave={handleSaveModal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="admin-page-header">
        <h2>Portfolio Works</h2>
        <p>Manage the projects shown in the Works gallery on the landing page.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="admin-card__title" style={{ margin: 0 }}>All Works</div>
          <button className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={() => setModal({ mode: 'add' })}>+ Add Work</button>
        </div>

        <div className="admin-works-grid">
          {items.map((work, i) => (
            <div key={work.id || i} className="admin-work-card">
              {work.image
                ? <img className="admin-work-card__img" src={work.image} alt={work.title} />
                : <div className="admin-work-card__img-placeholder">
                    <svg width="32" height="32" fill="none" stroke="#333" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
              }
              <div className="admin-work-card__body">
                <div className="admin-work-card__title">{work.title}</div>
                <div className="admin-work-card__cat">{work.category}</div>
                <div className="admin-work-card__actions">
                  <button className="admin-btn admin-btn--secondary admin-btn--sm"
                    onClick={() => setModal({ mode: 'edit', index: i, work })}>Edit</button>
                  <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => remove(i)}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button className="admin-add-card" onClick={() => setModal({ mode: 'add' })}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Work
          </button>
        </div>
      </div>
    </div>
  );
}
