import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowRight, Tag, Layers } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/work-detail.css';

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [allWorks, setAllWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/content/works')
      .then(r => {
        const items = r.data.items || [];
        setAllWorks(items);
        const found = items.find(w => String(w.id) === String(id));
        setWork(found || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // GSAP entrance animation
  useEffect(() => {
    if (!work || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.wd-hero__img', { scale: 1.1, duration: 1.2 })
        .from('.wd-hero__overlay', { opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.wd-hero__category', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
        .from('.wd-hero__title', { opacity: 0, y: 50, duration: 0.8 }, '-=0.3')
        .from('.wd-hero__tags span', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.4')
        .from('.wd-back-btn', { opacity: 0, x: -30, duration: 0.5 }, '-=0.8')
        .from('.wd-content__block', { opacity: 0, y: 40, stagger: 0.15, duration: 0.7 }, '-=0.3')
        .from('.wd-nav__btn', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.4');
    });

    return () => ctx.revert();
  }, [work, loading]);

  // Prev / Next navigation
  const currentIndex = allWorks.findIndex(w => String(w.id) === String(id));
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wd-loading">
          <div className="wd-loading__spinner" />
          <p>Loading project…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!work) {
    return (
      <>
        <Navbar />
        <div className="wd-not-found">
          <h1>Project not found</h1>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/#works" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Works
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />

      <main className="wd-page">
        {/* ── HERO ── */}
        <section className="wd-hero" ref={heroRef}>
          <img
            src={work.heroImage || work.image || '/images/work-placeholder-1.jpg'}
            alt={work.title}
            className="wd-hero__img"
          />
          <div className="wd-hero__overlay" />

          {/* Back button */}
          <Link to="/#works" className="wd-back-btn" aria-label="Back to works">
            <ArrowLeft size={20} />
            <span>Back to Works</span>
          </Link>

          {/* Hero info */}
          <div className="wd-hero__info container">
            <p className="wd-hero__category">{work.category}</p>
            <h1 className="wd-hero__title">{work.title}</h1>
            {work.tags && work.tags.length > 0 && (
              <div className="wd-hero__tags">
                {work.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section className="wd-content section" ref={contentRef}>
          <div className="container wd-content__container">

            {/* Main — description & details */}
            <div className="wd-content__main">
              <div className="wd-content__block">
                <h2 className="wd-content__subtitle">About the Project</h2>
                <p className="wd-content__desc">
                  {work.description ||
                    `${work.title} is a ${work.category} project crafted with precision and creative vision. This work represents the intersection of strategic thinking and bold visual design — built to make a lasting impression.`}
                </p>
              </div>

              {/* Full image (repeated bigger) */}
              <div className="wd-content__block wd-content__img-wrap">
                <img
                  src={work.detailImage || work.image || '/images/work-placeholder-1.jpg'}
                  alt={work.title}
                  className="wd-content__img"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── PREV / NEXT NAV ── */}
        <nav className="wd-nav" aria-label="Project navigation">
          <div className="container wd-nav__inner">
            {prevWork ? (
              <button
                className="wd-nav__btn wd-nav__btn--prev"
                onClick={() => navigate(`/works/${prevWork.id}`)}
              >
                <ArrowLeft size={20} />
                <div className="wd-nav__btn-text">
                  <span className="wd-nav__btn-label">Previous</span>
                  <span className="wd-nav__btn-title">{prevWork.title}</span>
                </div>
              </button>
            ) : <div />}

            {nextWork ? (
              <button
                className="wd-nav__btn wd-nav__btn--next"
                onClick={() => navigate(`/works/${nextWork.id}`)}
              >
                <div className="wd-nav__btn-text">
                  <span className="wd-nav__btn-label">Next</span>
                  <span className="wd-nav__btn-title">{nextWork.title}</span>
                </div>
                <ArrowRight size={20} />
              </button>
            ) : <div />}
          </div>
        </nav>
      </main>

      <Footer />
    </>
  );
}
