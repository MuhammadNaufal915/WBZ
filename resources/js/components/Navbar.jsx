import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#works' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Handle SPA routing and hash scrolling
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      // Delay slightly to ensure Lenis or DOM rendering is ready
      const timer = setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname === '/') {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + href);
    }
  };

  return (
    <>
      <nav id="navbar" className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="WBZ Creative Studio" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/wbz-logo.png"
              alt="WBZ"
              className="navbar__logo-img"
            />
          </Link>

          {/* Desktop Links */}
          <ul className="navbar__links" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="btn btn-primary navbar__cta"
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                Let's Talk
              </a>
            </li>
            <li>
              <Link to="/admin/login" className="navbar__admin-link" aria-label="Admin login">
                Admin
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            id="hamburger-btn"
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={(e) => handleNavClick(e, '#contact')}
        >
          Let's Talk
        </a>
        <Link to="/admin/login" className="navbar__admin-link" style={{ fontSize: '0.75rem' }}
          onClick={() => setMenuOpen(false)}>
          Admin Portal
        </Link>
      </div>
    </>
  );
}
