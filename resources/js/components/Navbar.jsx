import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <>
      <nav id="navbar" className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Logo */}
          <a href="#" className="navbar__logo" aria-label="WBZ Creative Studio">
            <img
              src="/images/wbz-logo.png"
              alt="WBZ"
              className="navbar__logo-img"
            />
          </a>

          {/* Desktop Links */}
          <ul className="navbar__links" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="btn btn-primary navbar__cta"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
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
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
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
