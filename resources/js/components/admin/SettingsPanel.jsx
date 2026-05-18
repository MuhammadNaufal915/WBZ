import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Toast({ msg, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
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

export default function SettingsPanel() {
  const { admin } = useAuth();
  const [form, setForm]     = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.new_password_confirmation) {
      setToast({ msg: 'Password baru tidak cocok.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      await axios.post('/admin/change-password', form);
      setToast({ msg: 'Password berhasil diubah!', type: 'success' });
      setForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal mengubah password.';
      setToast({ msg, type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="admin-page-header">
        <h2>Settings</h2>
        <p>Manage your admin account settings and security.</p>
      </div>

      {/* Profile info card */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card__title">Account Info</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF5500, #FF7733)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.25rem', color: '#fff', flexShrink: 0,
          }}>
            {admin?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{admin?.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}>{admin?.email}</div>
            <div style={{ fontSize: '0.72rem', color: '#FF5500', marginTop: '0.4rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Change password card */}
      <div className="admin-card">
        <div className="admin-card__title">Change Password</div>
        <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
          <div className="admin-field">
            <label className="admin-label">Current Password</label>
            <input type="password" name="current_password" className="admin-input"
              value={form.current_password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="admin-field">
            <label className="admin-label">New Password <span style={{ color:'#333',textTransform:'none',fontWeight:400,letterSpacing:0 }}>(min. 8 chars)</span></label>
            <input type="password" name="new_password" className="admin-input"
              value={form.new_password} onChange={handleChange} placeholder="••••••••" required minLength={8} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Confirm New Password</label>
            <input type="password" name="new_password_confirmation" className="admin-input"
              value={form.new_password_confirmation} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving && <span className="admin-spinner" />}
              {saving ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
