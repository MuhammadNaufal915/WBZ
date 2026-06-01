import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import '../styles/footer.css';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Work', href: '#works' },
    { label: 'Contact', href: '#contact' },
  ],
  Connect: [
    { label: '@wbzclubhouse@gmail.com', href: 'mailto:wbzclubhouse@gmail.com' },
    { label: 'WhatsApp', href: 'https://wa.me/+628815279415' },
    { label: 'Instagram', href: 'https://www.instagram.com/wbzexperience?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { label: 'YouTube', href: 'https://youtube.com/@wbzexperience?si=m6mm_FVmzuzAJ767' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/wbz-811374487?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing' },
  ],
};

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/wbzexperience?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { label: 'Twitter/X', href: 'https://twitter.com/wbzexperience' },
  { label: 'YouTube', href: 'https://youtube.com/@wbzexperience?si=m6mm_FVmzuzAJ767' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand col */}
          <div className="footer__brand">
            <img
              src="/images/wbz-logo.png"
              alt="WBZ Creative Studio"
              className="footer__logo"
            />
            <p className="footer__desc">
              WBZ is a Bandung-based collective showcasing events, music, and street culture
            </p>
            <div className="footer__socials">
              {socials.map((social) => {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="footer__social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label.charAt(0)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="footer__col-title">{title}</h3>
              <ul className="footer__links" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} <span>WBZ Experience</span>. All rights reserved.
          </p>
          <Link to="/admin/login" className="footer__admin-link" aria-label="Admin Portal">
            Admin Portal
          </Link>
          <button
            className="footer__back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            id="back-to-top"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
