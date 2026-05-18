import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__orb login-page__orb--1" aria-hidden="true" />
      <div className="login-page__orb login-page__orb--2" aria-hidden="true" />

      <div className="login-card" role="main">
        <div className="login-card__logo">
          <img src="/images/wbz-logo.png" alt="WBZ" />
          <span className="login-card__badge">Admin Portal</span>
        </div>

        <h1 className="login-card__title">Welcome Back</h1>
        <p className="login-card__subtitle">Sign in to manage WBZ Creative Studio</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-form__error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div className="login-form__group">
            <label className="login-form__label" htmlFor="admin-email">Email</label>
            <div className="login-form__input-wrap">
              <span className="login-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input id="admin-email" type="email" className="login-form__input" placeholder="admin@wbz.id"
                value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
          </div>

          <div className="login-form__group">
            <label className="login-form__label" htmlFor="admin-password">Password</label>
            <div className="login-form__input-wrap">
              <span className="login-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input id="admin-password" type={showPass ? 'text' : 'password'} className="login-form__input"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password" />
              <button type="button" className="login-form__toggle" onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" id="admin-login-btn" className="login-form__submit" disabled={loading}>
            {loading && <span className="login-form__spinner" aria-hidden="true" />}
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <Link to="/" className="login-card__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to website
        </Link>

        <p className="login-card__footer">
          WBZ Creative Studio &copy; {new Date().getFullYear()} — Admin Access Only
        </p>
      </div>
    </div>
  );
}
