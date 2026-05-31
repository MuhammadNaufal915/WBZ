import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Film, UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function VideoEditor() {
  const [data, setData] = useState({
    type: 'upload',
    src: '',
    poster: '',
    label: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const videoInputRef = useRef(null);
  const posterInputRef = useRef(null);

  useEffect(() => {
    axios.get('/content/video')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    axios.put('/admin/content/video', data)
      .then(res => {
        setMessage('Video configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        setMessage('Error saving video configuration.');
        console.error(err);
      })
      .finally(() => setSaving(false));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check size (200MB max)
    if (file.size > 200 * 1024 * 1024) {
      alert("Video file is too large! Maximum allowed is 200MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    axios.post('/admin/upload-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      setData({ ...data, type: 'upload', src: res.data.url });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to upload video.");
    })
    .finally(() => setUploading(false));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPosterUploading(true);
    const formData = new FormData();
    formData.append('poster', file);

    axios.post('/admin/upload-poster', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      setData({ ...data, poster: res.data.url });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to upload poster.");
    })
    .finally(() => setPosterUploading(false));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-editor">
      <div className="admin-editor__header">
        <h2>Video Section (Showreel)</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || uploading || posterUploading}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && <div className="admin-alert">{message}</div>}

      <div className="admin-editor__grid">
        {/* Left Column - Configuration */}
        <div className="admin-card">
          <h3 className="admin-card__title">Video Source</h3>
          
          <div className="admin-form">
            <div className="admin-form-group">
              <label className="admin-label">Upload Video File</label>
              {data.src && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#1e1e1e', borderRadius: 4, fontSize: '0.85rem', wordBreak: 'break-all' }}>
                  Current file: <span style={{ color: '#FF5500' }}>{data.src}</span>
                </div>
              )}
              <input 
                type="file" 
                accept="video/mp4,video/webm,video/ogg,video/quicktime" 
                ref={videoInputRef} 
                style={{ display: 'none' }} 
                onChange={handleVideoUpload}
              />
              <button 
                className="btn" 
                onClick={() => videoInputRef.current.click()}
                disabled={uploading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <UploadCloud size={18} />
                {uploading ? 'Uploading Video (Please wait)...' : 'Select Video File (Max 200MB)'}
              </button>
            </div>

            <div className="admin-form-group" style={{ marginTop: '2rem', borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem' }}>
              <label className="admin-label">Video Label (Overlay Text)</label>
              <input
                type="text"
                name="label"
                value={data.label}
                onChange={handleChange}
                className="admin-input"
                placeholder="e.g., WBZ Showreel 2024"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Poster Image (Thumbnail)</label>
              <small style={{ color: '#888', marginBottom: '0.5rem', display: 'block' }}>
                Image shown while the video is loading.
              </small>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {data.poster && (
                  <img src={data.poster} alt="Poster" style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #333' }} />
                )}
                
                <div style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={posterInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handlePosterUpload}
                  />
                  <button 
                    className="btn" 
                    onClick={() => posterInputRef.current.click()}
                    disabled={posterUploading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <ImageIcon size={16} />
                    {posterUploading ? 'Uploading...' : (data.poster ? 'Change Poster' : 'Upload Poster')}
                  </button>
                  {data.poster && (
                    <button 
                      onClick={() => setData({...data, poster: ''})} 
                      style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '0.8rem', marginTop: '0.5rem', cursor: 'pointer', padding: 0 }}
                    >
                      Remove Poster
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="admin-card">
          <h3 className="admin-card__title">Preview</h3>
          
          <div style={{ background: '#080808', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
            {data.src ? (
              data.src.includes('youtube') || data.src.includes('youtu.be') ? (
                <iframe
                  src={data.src}
                  title={data.label}
                  allow="autoplay; fullscreen"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <video 
                  src={data.src} 
                  poster={data.poster || undefined}
                  autoPlay 
                  muted 
                  loop 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              )
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', flexDirection: 'column', gap: '0.5rem' }}>
                <Film size={32} opacity={0.5} />
                <span>No video source provided</span>
              </div>
            )}
            
            {/* Label preview */}
            {data.label && (
              <div style={{ position: 'absolute', top: 16, left: 16, color: '#FF5500', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4 }}>
                <span style={{ display: 'inline-block', width: 12, height: 2, background: '#FF5500' }}></span>
                {data.label}
              </div>
            )}
          </div>
          
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '1rem', lineHeight: 1.5 }}>
            This is how the video will appear. On the live site, it will start small and scale up to fullscreen as the user scrolls down the page.
          </p>
        </div>
      </div>
    </div>
  );
}
