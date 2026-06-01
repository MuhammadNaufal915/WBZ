import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../styles/hero.css';

export default function Hero() {
  const labelRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const scrollRef = useRef(null);
  const statsRef = useRef(null);

  const [data, setData] = useState(null);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axios.get('/content/hero')
      .then(r => setData(r.data))
      .catch(console.error);
      
    axios.get('/content/about')
      .then(r => setAboutData(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data) return; // Wait for data to load

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      const words = document.querySelectorAll('.hero__headline-word');
      if (words.length) {
        tl.to(words, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
        }, '-=0.4');
      }

      tl.to([subRef.current, actionsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      }, '-=0.5');

      tl.to(scrollRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.3');

      tl.to(statsRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.5');
    });

    return () => ctx.revert();
  }, [data]);

  if (!data) return <section id="home" className="hero" />;

  const lines = data.headline.split('\\n');

  return (
    <section id="home" className="hero" aria-label="Hero section">
      <div className="hero__bg">
        <div className="hero__gradient" />
        <div className="hero__lines">
          <div className="hero__line" />
          <div className="hero__line" />
          <div className="hero__line" />
        </div>
      </div>

      <img
        src="/images/wbz-logo.png"
        alt=""
        className="hero__watermark"
        aria-hidden="true"
      />

      <div className="hero__content">
        <div ref={labelRef} className="hero__label">
          <span className="hero__label-dot" />
          WBZ Experience — Est. 2024
        </div>

        <h1 className="hero__headline">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="hero__headline-line">
              {line.split(' ').map((word, wordIndex) => {
                const isLast = lineIndex === lines.length - 1 && wordIndex === line.split(' ').length - 1;
                return (
                  <React.Fragment key={wordIndex}>
                    <span className={`hero__headline-word ${isLast ? 'hero__headline-accent' : ''}`}>
                      {word}
                    </span>
                    {wordIndex < line.split(' ').length - 1 && '\u00A0'}
                  </React.Fragment>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <p ref={subRef} className="hero__tagline">{data.subtitle}</p>
          <div ref={actionsRef} className="hero__actions">
            <a href="#works" className="btn btn-primary" id="hero-view-works">
              {data.cta_primary}
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-outline" id="hero-contact">
              {data.cta_secondary}
            </a>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>

      {/* Stats fetched from About data */}
      <div ref={statsRef} className="hero__stats" aria-label="Studio statistics">
        {aboutData ? (
          aboutData.stats.slice(0, 3).map((stat, i) => (
            <div key={i} className="hero__stat">
              <div className="hero__stat-num">{stat.number}</div>
              <div className="hero__stat-label">{stat.label}</div>
            </div>
          ))
        ) : (
          <>
            <div className="hero__stat">
              <div className="hero__stat-num">50+</div>
              <div className="hero__stat-label">Projects</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-num">30+</div>
              <div className="hero__stat-label">Clients</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-num">2+</div>
              <div className="hero__stat-label">Years</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
