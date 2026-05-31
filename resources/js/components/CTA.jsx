import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Quote } from 'lucide-react';
import axios from 'axios';
import '../styles/cta.css';

gsap.registerPlugin(ScrollTrigger);

// Renders a row of stars (filled / empty)
function StarRow({ value, size = 14 }) {
  return (
    <div className="rc-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={size}
          className={s <= value ? 'star-active' : 'star-inactive'}
          fill={s <= value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function CTA() {
  const sectionRef = useRef(null);
  const trackRef    = useRef(null);
  const animRef     = useRef(null);

  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratings, setRatings]           = useState([]);
  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [rating, setRating]             = useState(5);
  const [message, setMessage]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Fetch ratings on mount ── */
  useEffect(() => {
    axios.get('/ratings')
      .then(res => { if (Array.isArray(res.data)) setRatings(res.data); })
      .catch(console.error);
  }, []);

  /* ── GSAP scroll-reveal for static elements ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.cta .reveal').forEach(el => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── Marquee animation: runs / rebuilds when ratings change ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || ratings.length === 0) return;

    // Kill previous animation
    if (animRef.current) animRef.current.kill();

    // Clone the track so the scroll loops seamlessly
    const clone = track.querySelector('.marquee-clone');
    if (clone) clone.remove();
    const original = track.querySelector('.marquee-inner');
    const dup = original.cloneNode(true);
    dup.classList.add('marquee-clone');
    track.appendChild(dup);

    const totalWidth = original.scrollWidth;

    animRef.current = gsap.to(track, {
      x: `-=${totalWidth}`,
      duration: ratings.length * 5,   // ~5s per card
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
      },
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => animRef.current?.pause());
    track.addEventListener('mouseleave', () => animRef.current?.resume());

    return () => {
      if (animRef.current) animRef.current.kill();
      track.removeEventListener('mouseenter', () => {});
      track.removeEventListener('mouseleave', () => {});
    };
  }, [ratings]);

  /* ── Computed stats ── */
  const avgRating = useMemo(() => {
    if (!ratings.length) return 0;
    return (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);
  }, [ratings]);

  /* ── Form submit ── */
  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    axios.post('/ratings', { name, email, rating, message })
      .then(res => {
        setRatings(prev => [res.data.data, ...prev]);
        setIsRatingOpen(false);
        setName(''); setEmail(''); setRating(5); setMessage('');
      })
      .catch(err => {
        console.error(err);
        alert('Gagal mengirim: ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <section id="contact" className="cta" ref={sectionRef} aria-label="Contact us">
      <div className="cta__watermark" aria-hidden="true">LET'S TALK</div>

      <div className="container">
        <div className="cta__inner">
          <div className="cta__label reveal">Get In Touch</div>
          <h2 className="cta__heading reveal">
            Let's Work
            <span>Together</span>
          </h2>
          <p className="cta__sub reveal">
            Looking to join our upcoming events or simply have a few questions?&nbsp;
            We're always excited to connect. Reach out to us today!
          </p>

          {/* ── Buttons ── */}
          <div className="cta__actions reveal">
            <button
              onClick={() => setIsRatingOpen(!isRatingOpen)}
              id="cta-rating-btn"
              className={`btn btn-primary btn-large ${isRatingOpen ? 'btn-active' : ''}`}
            >
              <Star size={18} fill={isRatingOpen ? 'currentColor' : 'none'} />
              RATING US
            </button>
            <a
              href="https://wa.me/62xxxxxxxxxx"
              target="_blank" rel="noopener noreferrer"
              id="cta-whatsapp-btn"
              className="btn btn-outline btn-large"
            >
              WhatsApp Us
              <ArrowRight size={16} />
            </a>
          </div>

          {/* ── Rating Form ── */}
          {isRatingOpen && (
            <div className="cta__rating-form">
              <h3>Leave Your Review</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <input type="text"  placeholder="Your name (optional)" value={name}    onChange={e => setName(e.target.value)}    className="form-control" />
                  <input type="email" placeholder="Your email (optional)" value={email}   onChange={e => setEmail(e.target.value)}   className="form-control" />
                </div>

                <div className="form-group">
                  <p className="form-label">Your rating</p>
                  <div className="rating-stars-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button" key={star}
                        onClick={() => setRating(star)}
                        className="star-btn"
                        aria-label={`${star} stars`}
                      >
                        <Star
                          size={32}
                          className={star <= rating ? 'star-active' : 'star-inactive'}
                          fill={star <= rating ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    placeholder="Share your experience…"
                    rows="3"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large form-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── Testimonial Marquee (full-width, outside .container) ── */}
      {Array.isArray(ratings) && ratings.length > 0 && (
        <div className="testimonials-section">
          {/* Stat bar */}
          <div className="testimonials-stat">
            <span className="stat-avg">{avgRating}</span>
            <div className="stat-right">
              <StarRow value={Math.round(avgRating)} size={18} />
              <span className="stat-count">{ratings.length} review{ratings.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <p className="testimonials-label">WHAT PEOPLE SAY</p>

          {/* Marquee track */}
          <div className="marquee-viewport">
            <div className="marquee-track" ref={trackRef}>
              <div className="marquee-inner">
                {ratings.map(r => (
                  <div key={r.id} className="tc-card">
                    <Quote size={20} className="tc-quote-icon" />
                    {r.message && <p className="tc-msg">"{r.message}"</p>}
                    <div className="tc-footer">
                      <span className="tc-name">{r.name || 'Anonymous'}</span>
                      <StarRow value={r.rating} size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fade edges */}
          <div className="marquee-fade marquee-fade-left"  aria-hidden="true" />
          <div className="marquee-fade marquee-fade-right" aria-hidden="true" />
        </div>
      )}
    </section>
  );
}
