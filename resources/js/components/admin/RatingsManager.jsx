import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Trash2, RefreshCw } from 'lucide-react';

function StarRow({ value }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={13}
          style={{ color: s <= value ? '#FF5500' : '#333', fill: s <= value ? '#FF5500' : 'none' }}
        />
      ))}
    </span>
  );
}

export default function RatingsManager() {
  const [ratings,   setRatings]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);  // id currently being deleted
  const [confirmId, setConfirmId] = useState(null);  // id awaiting confirm

  const fetchRatings = () => {
    setLoading(true);
    axios.get('/ratings')
      .then(res => setRatings(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRatings(); }, []);

  const handleDelete = (id) => {
    setDeleting(id);
    axios.delete(`/admin/ratings/${id}`)
      .then(() => {
        setRatings(prev => prev.filter(r => r.id !== id));
        setConfirmId(null);
      })
      .catch(err => alert('Gagal menghapus: ' + (err.response?.data?.message || err.message)))
      .finally(() => setDeleting(null));
  };

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
    : '—';

  return (
    <div className="rm-wrap">

      {/* ── Header stat bar ── */}
      <div className="rm-stat-bar">
        <div className="rm-stat">
          <span className="rm-stat__val">{ratings.length}</span>
          <span className="rm-stat__lbl">Total Reviews</span>
        </div>
        <div className="rm-divider" />
        <div className="rm-stat">
          <span className="rm-stat__val" style={{ color: '#FF5500' }}>{avgRating}</span>
          <span className="rm-stat__lbl">Avg Rating</span>
        </div>
        <div className="rm-divider" />
        <div className="rm-stat">
          <StarRow value={Math.round(parseFloat(avgRating) || 0)} />
          <span className="rm-stat__lbl">Score</span>
        </div>

        <button
          className="rm-refresh-btn"
          onClick={fetchRatings}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="rm-loading">
          <div className="rm-spinner" />
          Loading ratings…
        </div>
      ) : ratings.length === 0 ? (
        <div className="rm-empty">No ratings yet.</div>
      ) : (
        <div className="rm-table-wrap">
          <table className="rm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, idx) => (
                <tr key={r.id} className={confirmId === r.id ? 'rm-row--confirm' : ''}>
                  <td className="rm-td-num">{idx + 1}</td>
                  <td className="rm-td-name">{r.name || <span className="rm-anon">Anonymous</span>}</td>
                  <td className="rm-td-email">{r.email || '—'}</td>
                  <td><StarRow value={r.rating} /></td>
                  <td className="rm-td-msg">
                    {r.message
                      ? <span className="rm-msg-text">"{r.message}"</span>
                      : <span className="rm-anon">—</span>}
                  </td>
                  <td className="rm-td-date">
                    {new Date(r.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="rm-td-action">
                    {confirmId === r.id ? (
                      <div className="rm-confirm">
                        <span className="rm-confirm__text">Hapus?</span>
                        <button
                          className="rm-btn rm-btn--danger"
                          onClick={() => handleDelete(r.id)}
                          disabled={deleting === r.id}
                        >
                          {deleting === r.id ? '…' : 'Ya'}
                        </button>
                        <button
                          className="rm-btn rm-btn--ghost"
                          onClick={() => setConfirmId(null)}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        className="rm-delete-btn"
                        onClick={() => setConfirmId(r.id)}
                        title="Hapus rating ini"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
